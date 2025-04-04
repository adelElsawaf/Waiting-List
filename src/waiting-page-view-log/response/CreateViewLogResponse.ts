import WaitingPageViewLogEntity from "../waiting-page-view-log.entity";

export class CreateViewLogResponse {
    id: number;
    waitingPageId: number;
    ipAddress: string;
    viewedAt: Date;

    static fromEntity(entity: WaitingPageViewLogEntity): CreateViewLogResponse {
        const response = new CreateViewLogResponse();
        response.id = entity.id;
        response.waitingPageId = entity.waitingPage?.id;
        response.ipAddress = entity.userIpAddress;
        response.viewedAt = entity.viewedAt;
        return response;
    }
}
