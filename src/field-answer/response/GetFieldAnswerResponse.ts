import { FieldAnswerEntity } from "src/field-answer/field-answer.entity";

export class GetFieldAnswerResponse {
    id: number;
    fieldTitle: string;  
    answer: string;

    constructor(id: number, fieldTitle: string, answer: string) {
        this.id = id;
        this.fieldTitle = fieldTitle;
        this.answer = answer;
    }

    static fromEntity(entity: FieldAnswerEntity): GetFieldAnswerResponse {
        return new GetFieldAnswerResponse(
            entity.id,
            entity.field?.title,
            entity.answer
        );
    }
}
