import { IsInt, Min, IsIP, IsNotEmpty } from 'class-validator';
import WaitingPageViewLogsEntity from '../waiting-page-view-log.entity';

export class CreateViewLogRequest {
    @IsInt({ message: 'waitingPageId must be an integer' })
    @Min(1, { message: 'waitingPageId must be a positive number' })
    waitingPageId: number;

    @IsNotEmpty({ message: 'userIpAddress must not be empty' })
    visitorId: string;

    toEntity(waitingPage: any): WaitingPageViewLogsEntity {
        const viewLog = new WaitingPageViewLogsEntity();
        viewLog.waitingPage = waitingPage;
        viewLog.visitorId = this.visitorId;
        return viewLog;
    }
}
