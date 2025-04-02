import { HttpException, HttpStatus } from "@nestjs/common";

export default class FieldNotFoundException extends HttpException {
    constructor(msg: string) {
        super(msg, HttpStatus.NOT_FOUND);
    }
}