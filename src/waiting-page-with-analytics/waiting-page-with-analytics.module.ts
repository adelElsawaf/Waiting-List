import { Module } from '@nestjs/common';
import { WaitingPageWithAnalyticsService } from './waiting-page-with-analytics.service';
import { WaitingPageWithAnalyticsController } from './waiting-page-with-analytics.controller';
import { WaitingPageModule } from 'src/waiting-page/waiting-page.module';
import { WaitingPageViewLogModule } from 'src/waiting-page-view-log/waiting-page-view-log.module';
import { FormSubmissionModule } from 'src/form-submission/form-submission.module';

@Module({
  imports:[WaitingPageModule,WaitingPageViewLogModule , FormSubmissionModule],
  providers: [WaitingPageWithAnalyticsService],
  controllers: [WaitingPageWithAnalyticsController]
})
export class WaitingPageWithAnalyticsModule {}
