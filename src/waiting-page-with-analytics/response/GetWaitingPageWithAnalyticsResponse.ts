import GetWaitingPageResponseDTO from "src/waiting-page/response/GetWaitingPageResponseDTO";

export class GetWaitingPageWithAnalyticsResponse {
    waitingPage : GetWaitingPageResponseDTO;
    numberOfUniqueViewers: number;
    numberOfSubmissions: number;

    static fromEntity(waitingPage: GetWaitingPageResponseDTO, numberOfUniqueViewers: number , numberOfSubmissions:number): GetWaitingPageWithAnalyticsResponse {
        const dto = new GetWaitingPageWithAnalyticsResponse();
        dto.waitingPage = waitingPage;
        dto.numberOfUniqueViewers = numberOfUniqueViewers;
        dto.numberOfSubmissions = numberOfSubmissions;
        return dto;
    }
}