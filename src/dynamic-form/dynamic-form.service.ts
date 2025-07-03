import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DynamicFormEntity } from './dynamic-form.entity';
import { EntityManager, Repository } from 'typeorm';
import { WaitingPageService } from 'src/waiting-page/waiting-page.service';
import { FieldService } from 'src/field/field.service';
import { CreateDynamicFormRequest } from './request/CreateDynamicFormRequest';
import { CreateDynamicFormResponse } from './response/CreateDynamicFormResponse';
import { UserEntity } from 'src/user/user.entity';
import { FormNotFoundException } from './exception/FormNotFoundException';
import { FormHasNoFieldsException } from './exception/FormHasNoFieldsException';
import { FormViewLogsService } from 'src/form-view-logs/form-view-logs.service';

@Injectable()
export class DynamicFormService {
    constructor(
        @InjectRepository(DynamicFormEntity)
        private readonly dynamicFormRepository: Repository<DynamicFormEntity>,
        private readonly waitingPageService: WaitingPageService,
        private readonly fieldService: FieldService,
        private readonly formViewLogsService : FormViewLogsService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) { }
    async createForm(
        createDto: CreateDynamicFormRequest,
        loggedInUser: UserEntity
    ): Promise<CreateDynamicFormResponse> {
        return await this.entityManager.transaction(async (transactionalEntityManager) => {
            const waitingPage = await this.waitingPageService.getWaitingPageByIdAsEntity(createDto.waitingPageId);

            if (!waitingPage) {
                throw new NotFoundException('Waiting Page not found');
            }

            if (loggedInUser.id !== waitingPage.owner.id) {
                throw new UnauthorizedException('You are not the owner of the page');
            }
            if(waitingPage.forms.length >= 5) {
                throw new UnauthorizedException('Waiting page already has 5 forms');
            }

            // Create new form entity linked to waitingPage
            const form = transactionalEntityManager.create(DynamicFormEntity, { waitingPage });

            // Deactivate any active form version
            await this.deactivateFormActiveVersion(waitingPage.id);

            form.isActive = true;

            const savedForm = await transactionalEntityManager.save(form);

            // Prepare fields: add seed data only if no forms exist on the waiting page
            let fieldsWithFormId = createDto.fields.map((field) => ({
                ...field,
                form: savedForm,
            }));

            if (waitingPage.forms.length === 0) {
                const seedFields = this.fieldService.getSeedData().map((field) => ({
                    ...field,
                    form: savedForm,
                }));
                fieldsWithFormId = [...fieldsWithFormId, ...seedFields];
            }

            const fields = await this.fieldService.createListOfFields(fieldsWithFormId, transactionalEntityManager);

            const dynamicFormWithFields = { ...savedForm, fields };

            return CreateDynamicFormResponse.fromEntity(dynamicFormWithFields);
        });
    }
      
    async activateFormActiveVersion(waitingPageId: number , formId: number) {
        await this.deactivateFormActiveVersion(waitingPageId);
        const targetForm = await this.getFormAsEntityById(formId);
        targetForm.isActive = true;
        return await this.dynamicFormRepository.save(targetForm);
    }

    async deactivateFormActiveVersion(waitingPageId: number) {
        const activeForm = await this.getFormActiveVersion(waitingPageId);
        if (!activeForm) return;
        activeForm.isActive = false;
        return await this.dynamicFormRepository.save(activeForm);
    }
    async getFormActiveVersion(waitingPageId: number) {
        return await this.dynamicFormRepository.findOne({
            where: { waitingPage: { id: waitingPageId }, isActive: true },
        });
    }


    async getFormFields(formId: number) {
        const form = await this.dynamicFormRepository.findOne({
            where: { id: formId },
            relations: ['fields'],
        });
        if (!form) throw new NotFoundException('Form not found');
        if (!form.fields.length) throw new FormHasNoFieldsException(formId);
        return form.fields;
    }

    async getFormAsEntityById(formId: number) {
        const form = await this.dynamicFormRepository.findOne({
            where: { id: formId },
        });
        if (!form) throw new FormNotFoundException(formId);
        return form;
    }

    async getFormTotalViewes(formId: number) {
        return await this.formViewLogsService.countUniqueViews(formId);
    }
}
