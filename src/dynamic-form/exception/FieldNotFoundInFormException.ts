import { NotFoundException } from '@nestjs/common';

export class FieldNotFoundInFormException extends NotFoundException {
    constructor(fieldId: number, formId: number) {
        super(`Field with ID ${fieldId} does not belong to form ${formId}.`);
    }
}
