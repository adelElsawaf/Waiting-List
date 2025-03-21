import { FieldTypeEnum } from "../enum/FieldTypeEnum";
import { FieldEntity } from "../field.entity";

export class CreateFieldResponse {
    id: number;
    title: string;
    placeholder?: string;
    isMandatory: boolean;
    type: FieldTypeEnum;
    static fromEntity(entity: FieldEntity): CreateFieldResponse {
        const dto = new CreateFieldResponse();
        dto.id = entity.id;
        dto.title = entity.title;
        dto.placeholder = entity.placeholder;
        dto.isMandatory = entity.isMandatory;
        dto.type = entity.type;
        return dto;
    }
}