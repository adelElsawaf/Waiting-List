import { Body, Controller, Post } from '@nestjs/common';
import { WaitingPageViewLogService } from './waiting-page-view-log.service';
import { CreateViewLogRequest } from './request/CreateViewLogRequest';
import { CreateViewLogResponse } from './response/CreateViewLogResponse';

@Controller('waiting-page-view-log')
export class WaitingPageViewLogController {
    constructor(
        private readonly waitingPageViewLogService: WaitingPageViewLogService
    ){}
    
    @Post()
    async createViewLog(
        @Body() request: CreateViewLogRequest): Promise<CreateViewLogResponse> {
        return await this.waitingPageViewLogService.createViewLog(request);
    }
}
