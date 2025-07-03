import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DynamicFormService } from './dynamic-form.service';
import { CreateDynamicFormRequest } from './request/CreateDynamicFormRequest';
import { DynamicFormEntity } from './dynamic-form.entity';
import { CreateDynamicFormResponse } from './response/CreateDynamicFormResponse';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { LoggedInUser } from 'src/user/decorator/loggedInUser';
import { UserEntity } from 'src/user/user.entity';
@Controller('dynamic-form')
export class DynamicFormController {
    constructor(private readonly dynamicFormService: DynamicFormService) {

    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createDynamicForm(
        @LoggedInUser() user: UserEntity,
        @Body() createDto: CreateDynamicFormRequest): Promise<CreateDynamicFormResponse> {
        return this.dynamicFormService.createForm(createDto, user);
    }
    @Put()
    @UseGuards(JwtAuthGuard)
    async updateDynamicForm(
        @LoggedInUser() user: UserEntity,
        @Body() createDto: CreateDynamicFormRequest): Promise<CreateDynamicFormResponse> {
        return this.dynamicFormService.createForm(createDto, user);
    }

    @Get('/:formId/total-views')
    async getFormTotalViewes(@Param('formId') formId: number) {
        return {totalViews: await this.dynamicFormService.getFormTotalViewes( formId)};
    }

    @Put('/:formId/waiting-page/:waitingPageId/activate')
    @UseGuards(JwtAuthGuard)
    async activateForm(@LoggedInUser() user: UserEntity, @Param('waitingPageId') waitingPageId: number, @Param('formId') formId: number) {
        return this.dynamicFormService.activateFormActiveVersion(waitingPageId, formId);
    }
}
