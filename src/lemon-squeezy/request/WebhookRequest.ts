import { IsString, IsNotEmpty, IsObject, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CustomData {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    credits: string;
}

class Meta {
    @IsString()
    @IsNotEmpty()
    event_name: string;

    @IsObject()
    @Type(() => CustomData)
    custom_data: CustomData;

    @IsOptional()
    @IsBoolean()
    test_mode?: boolean;

    @IsOptional()
    @IsString()
    webhook_id?: string;
}

export class WebhookRequest {
    @IsNotEmpty()
    @Type(() => Meta)
    meta: Meta;

    @IsOptional()
    @IsObject()
    data?: any; // Allow flexible data structure

    [key: string]: any; // Allow additional top-level fields
}