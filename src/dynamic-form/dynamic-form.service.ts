import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DynamicFormEntity } from './dynamic-form.entity';
import { EntityManager, Repository } from 'typeorm';
import { WaitingPageService } from 'src/waiting-page/waiting-page.service';
import { FieldService } from 'src/field/field.service';
import { CreateDynamicFormRequest } from './request/CreateDynamicFormRequest';
import { CreateDynamicFormResponse } from './response/CreateDynamicFormResponse';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class DynamicFormService {
    constructor(
        @InjectRepository(DynamicFormEntity)
        private readonly dynamicFormRepository: Repository<DynamicFormEntity>,
        private readonly waitingPageService: WaitingPageService,
        private readonly fieldService: FieldService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) { }
    async createForm(createDto: CreateDynamicFormRequest, loggedInUser: UserEntity): Promise<CreateDynamicFormResponse> {
        return await this.entityManager.transaction(async (transactionalEntityManager) => {
            const waitingPage = await this.waitingPageService.getWaitingPageByIdAsEntity(createDto.waitingPageId);
            if (!waitingPage) throw new NotFoundException('Waiting Page not found');
            if (loggedInUser.id != waitingPage.owner.id)
                throw new UnauthorizedException('You are not the owner of the page');
            const form = transactionalEntityManager.create(DynamicFormEntity, { waitingPage });
            const savedForm = await transactionalEntityManager.save(form);
            const fieldsWithFormId = createDto.fields.map((field) => ({
                ...field,
                form: savedForm,
            }));
            const fields = await this.fieldService.createListOfFields(fieldsWithFormId, transactionalEntityManager);
            const dynamicFormWithFields = {
                ...savedForm,
                fields,
            };
            return CreateDynamicFormResponse.fromEntity(dynamicFormWithFields);
        });
    }
}
