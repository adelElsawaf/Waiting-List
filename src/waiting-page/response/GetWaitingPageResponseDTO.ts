import GetDynamicFormResponse from "src/dynamic-form/response/GetDynamicFormResponse";
import { WaitingPageEntity } from "../waiting-page.entity";

export default class GetWaitingPageResponseDTO {
    id: number;
    title: string;
    subTitle: string;
    backgroundImageUrl: string;
    generatedTitle: string;
    shareableURL : string;
    form?: GetDynamicFormResponse;

    static fromEntity(entity:WaitingPageEntity, shareableURL: string): GetWaitingPageResponseDTO {
        return {
            id: entity.id,
            title: entity.title,
            subTitle: entity.subTitle,
            backgroundImageUrl: entity.backgroundImgUrl,
            generatedTitle: entity.generatedTitle,
            shareableURL: shareableURL,
            form: entity.form ? GetDynamicFormResponse.fromEntity(entity.form) : null,
        };
    }
}
