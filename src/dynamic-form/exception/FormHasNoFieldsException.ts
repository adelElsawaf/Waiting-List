import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

export class FormHasNoFieldsException extends UnprocessableEntityException {
    constructor(formId: number) {
        super(`Form with ID ${formId} has no fields.`);
    }
}
