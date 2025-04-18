import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCheckoutRequest {
    @IsString()
    @IsNotEmpty()
    variantId: string;
}