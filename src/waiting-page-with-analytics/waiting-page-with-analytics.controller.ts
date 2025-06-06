import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WaitingPageWithAnalyticsService } from './waiting-page-with-analytics.service';
import { GetWaitingPageWithAnalyticsResponse } from './response/GetWaitingPageWithAnalyticsResponse';
import { LoggedInUser } from 'src/user/decorator/loggedInUser';
import { UserEntity } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Controller('waiting-page-with-analytics')
export class WaitingPageWithAnalyticsController {
    constructor(
        private readonly waitingPageWithAnalyticsService: WaitingPageWithAnalyticsService,
    ) {}

   /* @UseGuards(JwtAuthGuard)
        @Get(":uniqueTitle")
    async getWaitingPageWithAnalytics(
        @Param("uniqueTitle") uniqueTitle: string,@LoggedInUser() user:UserEntity): Promise<GetWaitingPageWithAnalyticsResponse> {
        return this.waitingPageWithAnalyticsService.getWaitingPageWithAnalytics(uniqueTitle,user);
    }*/
}
