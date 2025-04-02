import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFieldAnswerRequest {
    @IsNotEmpty()
    @IsNumber()
    fieldId: number;

    @IsOptional()
    @IsString()  
    answer: string;
    
}
