import { IsEnum, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { FieldTypeEnum } from '../enum/FieldTypeEnum';

export class CreateFieldRequest {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    placeholder?: string;

    @IsBoolean()
    isMandatory: boolean;

    @IsEnum(FieldTypeEnum)
    type: FieldTypeEnum;

    @IsBoolean()
    @IsOptional()
    isSeeded:boolean;
}
