import { IsString, IsNumber } from 'class-validator';

export class CreateFormViewLogRequest {
    @IsString()
    visitorId: string;

    @IsNumber()
    formId: number;
}
