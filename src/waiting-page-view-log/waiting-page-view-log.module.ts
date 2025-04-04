import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitingPageViewLogService } from './waiting-page-view-log.service';
import { WaitingPageViewLogController } from './waiting-page-view-log.controller';
import WaitingPageViewDataEntity from './waiting-page-view-log.entity';
import { WaitingPageModule } from 'src/waiting-page/waiting-page.module';

@Module({
    imports: [TypeOrmModule.forFeature([WaitingPageViewDataEntity]),
    WaitingPageModule],
    providers: [WaitingPageViewLogService],
    controllers: [WaitingPageViewLogController],
    exports: [WaitingPageViewLogService]
})
export class WaitingPageViewLogModule { }
