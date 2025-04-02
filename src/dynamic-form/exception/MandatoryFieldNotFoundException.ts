import { BadRequestException } from '@nestjs/common';

export class MandatoryFieldEmptyException extends BadRequestException {
    constructor(msg: string) {
        super(msg);
    }
}
