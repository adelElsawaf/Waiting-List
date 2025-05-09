import { Controller, Get } from '@nestjs/common';
import { FieldService } from './field.service';

@Controller('field')
export class FieldController {

    constructor(private readonly fieldService: FieldService) { }
    @Get('seed')
    async getSeedFields() { 
        return  this.fieldService.getSeedData();
    }
}
