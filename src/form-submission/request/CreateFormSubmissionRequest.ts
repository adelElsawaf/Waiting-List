import { IsNotEmpty, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFieldAnswerRequest } from 'src/field-answer/request/CreateFieldAnswerRequest';

export class CreateFormSubmissionRequest {
    @IsNotEmpty()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateFieldAnswerRequest)
    answers: CreateFieldAnswerRequest[];
}
