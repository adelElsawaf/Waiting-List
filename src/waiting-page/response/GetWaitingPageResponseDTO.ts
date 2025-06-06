import GetDynamicFormResponse from "src/dynamic-form/response/GetDynamicFormResponse";
import { WaitingPageEntity } from "../waiting-page.entity";

export default class GetWaitingPageResponseDTO {
    id: number;
    title: string;
    subTitle: string;
    backgroundImageUrl: string;
    generatedTitle: string;
    shareableURL: string;
    forms?: GetDynamicFormResponse[];
    isFree: Boolean

    static fromEntity(entity: WaitingPageEntity): GetWaitingPageResponseDTO {
        return {
            id: entity.id,
            title: entity.title,
            subTitle: entity.subTitle,
            backgroundImageUrl: entity.backgroundImgUrl,
            generatedTitle: entity.generatedTitle,
            shareableURL: entity.shareableUrl,
            forms: entity.forms ? GetDynamicFormResponse.fromEntities(entity.forms) : null,
            isFree:entity.isFree,
        };
    }

    static fromEntities(entities: WaitingPageEntity[]): GetWaitingPageResponseDTO[] {
        return entities.map(entity => GetWaitingPageResponseDTO.fromEntity(entity));
    }
}
