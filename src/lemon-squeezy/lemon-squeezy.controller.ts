import { Body, Controller, Get, Post, Query, Headers, Req, RawBody } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { LemonSqueezyService } from './lemon-squeezy.service';
import { LoggedInUser } from 'src/user/decorator/loggedInUser';
import { CreateCheckoutRequest } from './request/CreateCheckoutRequest';
import { CreateCheckoutResponse } from './response/CreateCheckoutResponse';
import { WebhookRequest } from './request/WebhookRequest';
import { WebhookResponse } from './response/WebhookResponse';



@Controller('lemon-squeezy')
export class LemonSqueezyController {
    constructor(private lemonSqueezyService: LemonSqueezyService) { }

    @Get('checkout')
    async createCheckout(
        @Query('variantId') variantId: string,
        @LoggedInUser() user: UserEntity,
    ): Promise<CreateCheckoutResponse> {
        const request = new CreateCheckoutRequest();
        request.variantId = variantId;
        return this.lemonSqueezyService.createCheckout(request, user);
    }

    @Post('webhook')
    async handleWebhook(
        @Req() req: Request,
        @Headers('X-Signature') signature: string,
    ): Promise<WebhookResponse> {
        const rawBody = (req as any).body; // Buffer
        const parsedBody = JSON.parse(rawBody.toString()); // You still need parsed data for logic
        console.log(rawBody)
        return this.lemonSqueezyService.handleWebhook(parsedBody, signature, rawBody);
    }

}