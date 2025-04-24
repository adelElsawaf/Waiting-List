import WaitingPageViewLogEntity from "../waiting-page-view-log.entity";

export class CreateViewLogResponse {
    id: number;
    waitingPageId: number;
    visitorId: string;
    viewedAt: Date;

    static fromEntity(entity: WaitingPageViewLogEntity): CreateViewLogResponse {
        const response = new CreateViewLogResponse();
        response.id = entity.id;
        response.waitingPageId = entity.waitingPage?.id;
        response.visitorId = entity.visitorId;
        response.viewedAt = entity.viewedAt;
        return response;
    }
}
