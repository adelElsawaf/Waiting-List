import { GetFieldAnswerResponse } from "src/field-answer/response/GetFieldAnswerResponse";
import { FormSubmissionEntity } from "src/form-submission/form-submission.entity";

export class GetFormSubmissionResponse {
    submissionId: number;
    submittedAt: Date;
    answers: GetFieldAnswerResponse[];

    constructor(submissionId: number, submittedAt: Date, answers: GetFieldAnswerResponse[]) {
        this.submissionId = submissionId;
        this.submittedAt = submittedAt;
        this.answers = answers;
    }

    static fromEntity(entity: FormSubmissionEntity): GetFormSubmissionResponse {
        return new GetFormSubmissionResponse(
            entity.id,
            entity.createdAt,
            entity.answers?.map(GetFieldAnswerResponse.fromEntity) || [] // 🆕 Ensure answers are mapped
        );
    }

    static fromEntities(entities: FormSubmissionEntity[]): GetFormSubmissionResponse[] {
        return entities.map(GetFormSubmissionResponse.fromEntity);
    }
}
