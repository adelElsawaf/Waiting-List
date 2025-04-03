import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FieldEntity } from './field.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateFieldRequest } from './request/CreateFieldRequest';
import FieldNotFoundException from './exception/FieldNotFoundException';
import { FieldTypeEnum } from './enum/FieldTypeEnum';

@Injectable()
export class FieldService {
    constructor(
        @InjectRepository(FieldEntity)
        private readonly fieldRepository: Repository<FieldEntity>,
    ) { }

    async createListOfFields(fields: CreateFieldRequest[], entityManager?: EntityManager) {
        const fieldEntities = fields.map((field) => entityManager.create(FieldEntity, field));
        return await entityManager.save(fieldEntities);
    }

    async findFieldsAsEntitiesByIds(fieldIds: number[]): Promise<FieldEntity[]> {
        if (!fieldIds.length) {
            return [];
        }

        const fields = await this.fieldRepository.findByIds(fieldIds);

        if (fields.length !== fieldIds.length) {
            const foundIds = fields.map(f => f.id);
            const missingIds = fieldIds.filter(id => !foundIds.includes(id));
            throw new FieldNotFoundException(`Fields not found for IDs: ${missingIds.join(', ')}`);
        }

        return fields;
    }

     getSeedData () : CreateFieldRequest[] {
        return [
            {
                title: 'Email',
                type: FieldTypeEnum.EMAIL,
                placeholder: 'Enter your Email',
                isMandatory: true,
            }
        ]
    }
}
