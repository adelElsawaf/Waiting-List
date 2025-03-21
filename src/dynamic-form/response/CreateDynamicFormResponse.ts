import { CreateFieldResponse } from "src/field/response/CreateFieldResponse";
import { CreateWaitingPageResponseDTO } from "src/waiting-page/response/CreateWaitingPageResponseDTO";
import { DynamicFormEntity } from "../dynamic-form.entity";

export class CreateDynamicFormResponse {
    id: number;
    waitingPage: CreateWaitingPageResponseDTO;
    fields: CreateFieldResponse[];
    createdAt: Date;
    updatedAt: Date;

    static fromEntity(entity: DynamicFormEntity): CreateDynamicFormResponse {
        const dto = new CreateDynamicFormResponse();
        dto.id = entity.id;
        dto.waitingPage = CreateWaitingPageResponseDTO.fromEntity(entity.waitingPage);
        dto.fields = entity.fields.map(CreateFieldResponse.fromEntity);
        return dto;
    }
}
