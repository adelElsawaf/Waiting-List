import { Injectable } from '@nestjs/common';
import { LoggedInUser } from 'src/user/decorator/loggedInUser';
import { UserEntity } from 'src/user/user.entity';
import { WaitingPageViewLogService } from 'src/waiting-page-view-log/waiting-page-view-log.service';
import { WaitingPageService } from 'src/waiting-page/waiting-page.service';
import { GetWaitingPageWithAnalyticsResponse } from './response/GetWaitingPageWithAnalyticsResponse';
import { FormSubmissionService } from 'src/form-submission/form-submission.service';

@Injectable()
export class WaitingPageWithAnalyticsService {
    constructor (
        private readonly waitingPageService: WaitingPageService,
        private readonly waitingPageViewLogService: WaitingPageViewLogService,
        private readonly formSubmissionService : FormSubmissionService
    ){}
    async getWaitingPageWithAnalytics(uniqueTitle: string, loggedInUser: UserEntity): Promise<GetWaitingPageWithAnalyticsResponse> {
        const waitingPage = await this.waitingPageService.getWaitingPageByUniqueTitle(uniqueTitle,loggedInUser);
            const numberOfUniqueViewers = await this.waitingPageViewLogService.getNumberOfUniqueViewersForPage(waitingPage.id)
            const numberOfSubmissions =  await this.formSubmissionService.getFormSubmissionCount(waitingPage.form.id);
        return GetWaitingPageWithAnalyticsResponse.fromEntity(waitingPage, numberOfUniqueViewers, numberOfSubmissions);
    }


}
