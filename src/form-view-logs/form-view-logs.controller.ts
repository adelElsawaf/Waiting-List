import { FormViewLogsService } from './form-view-logs.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateFormViewLogRequest } from './request/CreateFormViewLogRequest';

@Controller('form-view-logs')
export class FormViewLogsController {
    constructor(private readonly formViewLogsService: FormViewLogsService) { }

    @Post()
    async logFormView(@Body() dto: CreateFormViewLogRequest) {
        await this.formViewLogsService.logView(dto.visitorId, dto.formId);
    }
  
}
