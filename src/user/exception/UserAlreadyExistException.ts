import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorObject } from 'src/shared/ErrorObject';

export class UserAlreadyExistException extends HttpException {
    constructor(message: string) {
        const error: ErrorObject = {
            message: message,
            statusCode: HttpStatus.CONFLICT,
            timeStamp: new Date()
        };
        super(error, HttpStatus.CONFLICT)
    }
}
