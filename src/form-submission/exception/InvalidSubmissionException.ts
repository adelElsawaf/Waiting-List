import { BadRequestException } from '@nestjs/common';

export class InvalidSubmissionException extends BadRequestException {
    constructor(msg: string) {
        super(msg);
    }
}
