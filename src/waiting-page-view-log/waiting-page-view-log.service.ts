import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import WaitingPageViewLogsEntity from './waiting-page-view-log.entity';
import { WaitingPageService } from 'src/waiting-page/waiting-page.service';
import { CreateViewLogRequest } from './request/CreateViewLogRequest';
import { CreateViewLogResponse } from './response/CreateViewLogResponse';

@Injectable()
export class WaitingPageViewLogService {
    constructor(
        @InjectRepository(WaitingPageViewLogsEntity)
        private readonly waitingPageViewLogRepository: Repository<WaitingPageViewLogsEntity>,
        private readonly waitingPageService: WaitingPageService,
    ){ }

    async createViewLog(request: CreateViewLogRequest): Promise<CreateViewLogResponse> {
        const waitingPage = await this.waitingPageService.getWaitingPageByIdAsEntity(request.waitingPageId);
        if (!waitingPage) throw new NotFoundException('Waiting Page not found');
        const viewLog = request.toEntity(waitingPage);
        const savedViewLog = await this.waitingPageViewLogRepository.save(viewLog);
        return CreateViewLogResponse.fromEntity(savedViewLog);
    }
    async getNumberOfUniqueViewersForPage(waitingPageId: number): Promise<number> {
        const result = await this.waitingPageViewLogRepository
            .createQueryBuilder('log')
            .select('COUNT(DISTINCT log.visitorId)', 'count')
            .where('log.waitingPageId = :waitingPageId', { waitingPageId })
            .getRawOne();

        return parseInt(result.count, 10);
    }
}
