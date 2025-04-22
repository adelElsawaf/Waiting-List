import { WaitingPageEntity } from "../waiting-page.entity";

export class CreateWaitingPageResponseDTO {
    id: number;
    title: string;
    subTitle: string;
    backgroundImageUrl: string;
    generatedTitle: string;
    shareableURL : string

    // Static mapper method
    static fromEntity(entity: WaitingPageEntity): CreateWaitingPageResponseDTO {
        const dto = new CreateWaitingPageResponseDTO();
        dto.id = entity.id;
        dto.title = entity.title;
        dto.subTitle = entity.subTitle;
        dto.backgroundImageUrl = entity.backgroundImgUrl;
        dto.generatedTitle = entity.generatedTitle;
        dto.shareableURL = entity.shareableUrl
        return dto;
    }
}
