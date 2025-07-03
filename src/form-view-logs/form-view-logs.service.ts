// src/form-view-logs/form-view-logs.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormViewLogEntity } from './form-view-logs.entity';

@Injectable()
export class FormViewLogsService {
    constructor(
        @InjectRepository(FormViewLogEntity)
        private readonly viewLogRepo: Repository<FormViewLogEntity>,
    ) { }

    async logView(visitorId: string, formId: number) {
        const log = this.viewLogRepo.create({
            visitorId,
            form: { id: formId },
        });

        await this.viewLogRepo.save(log);
    }
    async countUniqueViews(formId: number): Promise<number> {
        return this.viewLogRepo.count({
            where: { form: { id: formId } },
        });
    }
}
