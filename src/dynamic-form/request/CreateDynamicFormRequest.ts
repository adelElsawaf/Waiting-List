import { IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFieldRequest } from 'src/field/request/CreateFieldRequest';

export class CreateDynamicFormRequest {
    @IsNotEmpty()
    waitingPageId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFieldRequest)
    fields: CreateFieldRequest[];
}
