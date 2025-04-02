import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DynamicFormService } from 'src/dynamic-form/dynamic-form.service';
import { FieldAnswerService } from 'src/field-answer/field-answer.service';
import { FormSubmissionEntity } from './form-submission.entity';
import { Repository } from 'typeorm';
import { CreateFormSubmissionRequest } from './request/CreateFormSubmissionRequest';
import { CreateFormSubmissionResponse } from './response/CreateFormSubmissionResponse';
import { FormHasNoFieldsException } from 'src/dynamic-form/exception/FormHasNoFieldsException';
import { MandatoryFieldEmptyException } from 'src/dynamic-form/exception/MandatoryFieldNotFoundException';
import { InvalidSubmissionException } from './exception/InvalidSubmissionException';
import { GetFormSubmissionResponse } from './response/GetFormSubmissionResponse';

@Injectable()
export class FormSubmissionService {
    constructor(
        private readonly fieldAnswerService: FieldAnswerService,
        private readonly dynamicFormService: DynamicFormService,
        @InjectRepository(FormSubmissionEntity)
        private readonly formSubmissionRepository: Repository<FormSubmissionEntity>,

    ) { }

    async submitForm(formId: number, body: CreateFormSubmissionRequest): Promise<CreateFormSubmissionResponse> {
        const fields = await this.dynamicFormService.getFormFields(formId);
        // ✅ Convert fields into a Map for quick lookups
        const fieldMap = new Map(fields.map(field => [field.id, field]));
        const submittedFieldIds = new Set(body.answers.map(ans => ans.fieldId));
        // ✅ Track missing mandatory fields & invalid fields in a single loop
        const missingMandatoryFields: string[] = [];
        for (const field of fields) {
            if (field.isMandatory && !submittedFieldIds.has(field.id)) {
                missingMandatoryFields.push(field.title);
            }
        }
        if (missingMandatoryFields.length > 0) {
            throw new MandatoryFieldEmptyException(`Missing mandatory fields: ${missingMandatoryFields.join(', ')}`);
        }
        // ✅ Filter out answers that reference fields NOT in the form
        const validAnswers = body.answers.filter(answer => fieldMap.has(answer.fieldId));
        if (validAnswers.length !== body.answers.length) {
            throw new InvalidSubmissionException(`Some submitted fields do not belong to form ID ${formId}`);
        }

        const savedSubmission = await this.formSubmissionRepository.save({ form: { id: formId }, answers: validAnswers.map(answer => {
            const field = fieldMap.get(answer.fieldId) as any;
            return { field, answer: answer.answer.trim() };
        })});
        return new CreateFormSubmissionResponse(formId, validAnswers,savedSubmission.createdAt);
    }
    async getFormSubmissions(formId: number): Promise<GetFormSubmissionResponse[]> {
        const submissions = await this.formSubmissionRepository.find({
            where: { form: { id: formId } },
            relations: ['form', 'answers', 'answers.field'],
            order: { createdAt: 'DESC' },
        });

        if (!submissions.length) {
            throw new NotFoundException(`No submissions found for form ID ${formId}.`);
        }
        return submissions.map(GetFormSubmissionResponse.fromEntity);
    }

}
