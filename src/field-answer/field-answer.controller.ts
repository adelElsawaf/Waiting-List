import { Body, Controller, Post } from "@nestjs/common";
import { CreateFieldAnswerRequest } from "./request/CreateFieldAnswerRequest";
import { CreateFieldAnswerResponse } from "./response/CreateFieldAnswerResponse";
import { FieldAnswerService } from "./field-answer.service";

@Controller('field-answers')
export class FieldAnswerController {
}
