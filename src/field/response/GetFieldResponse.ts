import { GetFieldAnswerResponse } from "src/field-answer/response/GetFieldAnswerResponse";
import { FieldEntity } from "../field.entity";

export default class GetFieldResponse {
    id: number;
    title: string;
    placeholder?: string;
    isMandatory: boolean;
    type: string;
    answers?:GetFieldAnswerResponse[]

    static fromEntity(entity): GetFieldResponse {
        return {
            id: entity.id,
            title: entity.title,
            placeholder: entity.placeholder,
            isMandatory: entity.isMandatory,
            type: entity.type,
            answers:entity.answers
        };
    }

    static fromEntities(entities): GetFieldResponse[] {
        return entities.map(GetFieldResponse.fromEntity);
    }
}
