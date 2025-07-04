import GetFieldResponse from "src/field/response/GetFieldResponse";
import { GetFormSubmissionResponse } from "src/form-submission/response/GetFormSubmissionResponse";

export default class GetDynamicFormResponse {
    id: number;
    title: string;
    fields: GetFieldResponse[];
    submissions?:GetFormSubmissionResponse[];
    isActive?: boolean

    static fromEntity(entity): GetDynamicFormResponse {
        return {
            id: entity.id,
            title: entity.title,
            fields: GetFieldResponse.fromEntities(entity.fields),
            submissions: entity.submissions ?  GetFormSubmissionResponse.fromEntities(entity.submissions) : null,
            isActive:entity.isActive
        };
    }
    static fromEntities(entities): GetDynamicFormResponse[] {
        return entities.map(entity=> GetDynamicFormResponse.fromEntity(entity));
    }
}
