import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateFormSubmissionRequest } from './request/CreateFormSubmissionRequest';
import { CreateFormSubmissionResponse } from './response/CreateFormSubmissionResponse';
import { FormSubmissionService } from './form-submission.service';

@Controller('form-submission')
export class FormSubmissionController {
    constructor(
        private readonly formSubmissionService: FormSubmissionService
    ){}

    @Post('/form/:formId')
    async submitForm(
        @Param('formId') formId: number,
        @Body() body: CreateFormSubmissionRequest,
    ): Promise<CreateFormSubmissionResponse> {
        return this.formSubmissionService.submitForm(formId, body);
    }

    @Get('form/:formId')
    async getFormSubmissions(@Param('formId') formId: number) {
        return this.formSubmissionService.getFormSubmissions(formId);
    }
}
