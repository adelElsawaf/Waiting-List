import { NotFoundException } from '@nestjs/common';

export class FormNotFoundException extends NotFoundException {
    constructor(formId: number) {
        super(`Form with ID ${formId} not found.`);
    }
}
