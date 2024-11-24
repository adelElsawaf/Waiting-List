import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorObject } from "src/shared/ErrorObject";

export class UserNotFoundException extends HttpException {
    constructor(message: string) {
        const error: ErrorObject = {
            message: message,
            statusCode: HttpStatus.NOT_FOUND,
            timeStamp: new Date()
        };
        super(error, HttpStatus.NOT_FOUND)
    }
}