import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldAnswerEntity } from './field-answer.entity';
import { FieldService } from 'src/field/field.service';
import { CreateFieldAnswerRequest } from './request/CreateFieldAnswerRequest';
import { CreateFieldAnswerResponse } from './response/CreateFieldAnswerResponse';

@Injectable()
export class FieldAnswerService {
    constructor(
        @InjectRepository(FieldAnswerEntity)
        private readonly fieldAnswerRepository: Repository<FieldAnswerEntity>,
    ) { }

    async createBatchFieldAnswers(submission: CreateFieldAnswerRequest[]): Promise<CreateFieldAnswerResponse[]> {
        const answersToSave = submission.map(({ fieldId, answer }) => {
            const answerEntity = new FieldAnswerEntity();
            answerEntity.field = { id: fieldId } as any;
            answerEntity.answer = answer.trim();
            return answerEntity;
        });
        const savedAnswers = await this.fieldAnswerRepository.save(answersToSave);
        return savedAnswers.map(answer => ({
            fieldId: answer.field.id,
            answer: answer.answer,
        }));
    }
}
