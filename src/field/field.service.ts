import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FieldEntity } from './field.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateFieldRequest } from './request/CreateFieldRequest';

@Injectable()
export class FieldService {
    constructor(
    @InjectRepository(FieldEntity)
    private readonly fieldRepository : Repository<FieldEntity>,
    ){}

    async createListOfFields(fields: CreateFieldRequest[], entityManager?: EntityManager) {
        const fieldEntities = fields.map((field) => entityManager.create(FieldEntity, field));
        return await entityManager.save(fieldEntities);
    }
}
