// src/form-view-logs/form-view-logs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormViewLogsService } from './form-view-logs.service';
import { FormViewLogEntity } from './form-view-logs.entity';
import { FormViewLogsController } from './form-view-logs.controller';

@Module({
    imports: [TypeOrmModule.forFeature([FormViewLogEntity])],
    providers: [FormViewLogsService],
    exports: [FormViewLogsService],
    controllers: [FormViewLogsController],
})
export class FormViewLogsModule { }
