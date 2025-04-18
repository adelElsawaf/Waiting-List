import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/user.entity';
import { CreateCheckoutRequest } from './request/CreateCheckoutRequest';
import { CreateCheckoutResponse } from './response/CreateCheckoutResponse';
import { WebhookRequest } from './request/WebhookRequest';
import { WebhookResponse } from './response/WebhookResponse';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LemonSqueezyService {
    private variantCreditMap: { [key: string]: number } = {
        '767803': 200, // Replace with your actual Variant IDs
        '767807': 500,
        '767809': 1000,
    };

    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ) { }

    async createCheckout(
        request: CreateCheckoutRequest,
        user: UserEntity,
    ): Promise<CreateCheckoutResponse> {
        if (!user) throw new UnauthorizedException('User not authenticated');
        if (!this.variantCreditMap[request.variantId]) throw new Error('Invalid variant ID');

        const apiKey = this.configService.get<string>('LEMONSQUEEZY_API_KEY');
        const storeId = this.configService.get<string>('LEMONSQUEEZY_STORE_ID');
        const credits = this.variantCreditMap[request.variantId];

        const checkoutData = {
            data: {
                type: 'checkouts',
                attributes: {
                    checkout_data: {
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        custom: {
                            userId: user.id.toString(),
                            credits: credits.toString(),
                        },
                    },
                    checkout_options: {
                        button_color: '#2DD272',
                    },
                    product_options: {
                        enabled_variants: [parseInt(request.variantId, 10)],
                        redirect_url: `${this.configService.get<string>('FRONT_END_URL')}/create-page`,
                    },
                },
                relationships: {
                    store: {
                        data: {
                            type: 'stores',
                            id: storeId,
                        },
                    },
                    variant: {
                        data: {
                            type: 'variants',
                            id: request.variantId,
                        },
                    },
                },
            },
        };
        console.log(checkoutData)
        try {
            const response = await axios.post(
                'https://api.lemonsqueezy.com/v1/checkouts',
                checkoutData,
                {
                    headers: {
                        Accept: 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                },
            );

            const checkoutUrl = response.data.data.attributes.url;
            console.log(`Generated checkout URL for user ${user.id}: ${checkoutUrl}`);
            return { checkoutUrl };
        } catch (error) {
            console.error('Checkout error:', JSON.stringify(error.response?.data, null, 2));
            throw new Error('Failed to create checkout');
        }
    }

    async handleWebhook(
        webhookRequest: WebhookRequest,
        signature: string,
        rawBody: Buffer,
    ): Promise<WebhookResponse> {
        console.log('Received webhook:', JSON.stringify(webhookRequest, null, 2));
        console.log('Received signature:', signature);

        const signingSecret = this.configService.get<string>('LEMONSQUEEZY_SIGNING_SECRET');
        if (!signingSecret) {
            console.error('LEMONSQUEEZY_SIGNING_SECRET is not set');
            throw new Error('Webhook signing secret not configured');
        }

        const hmac = crypto
            .createHmac('sha256', signingSecret)
            .update(rawBody)
            .digest('hex');


        console.log('Computed HMAC:', hmac);

        if (hmac !== signature) {
            console.error('Invalid webhook signature. Expected:', hmac, 'Received:', signature);
            throw new UnauthorizedException('Invalid webhook signature');
        }

        const eventName = webhookRequest.meta.event_name;
        console.log('Webhook event:', eventName);

        if (eventName === 'order_created') {
            const customData = webhookRequest.meta.custom_data;
            if (!customData || !customData.userId || !customData.credits) {
                console.error('Invalid custom data in webhook:', customData);
                throw new BadRequestException('Invalid custom data');
            }

            const userId = parseInt(customData.userId, 10);
            const creditsToAdd = parseInt(customData.credits, 10);

            if (isNaN(userId) || isNaN(creditsToAdd)) {
                console.error('Invalid userId or credits in webhook:', customData);
                throw new BadRequestException('Invalid userId or credits');
            }

            try {
                await this.userService.incrementUserCredit(userId, creditsToAdd);
                console.log(`Added ${creditsToAdd} credits to user ${userId}`);
            } catch (error) {
                console.error('Error updating credits:', error.message);
                throw error;
            }
        } else {
            console.log(`Ignoring webhook event: ${eventName}`);
        }

        return { received: true };
    }
}