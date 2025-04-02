import { CreateFieldAnswerResponse } from "src/field-answer/response/CreateFieldAnswerResponse";

export class CreateFormSubmissionResponse {
    formId: number;
    submittedAt:Date
    answers: CreateFieldAnswerResponse[];

    constructor(formId: number, answers: CreateFieldAnswerResponse[] , submittedAt:Date) {
        this.formId = formId;
        this.submittedAt = submittedAt
        this.answers = answers;
    }
}
