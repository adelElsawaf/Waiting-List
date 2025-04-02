import { Module } from '@nestjs/common';
import { FieldAnswerService } from './field-answer.service';
import { FieldAnswerController } from './field-answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldAnswerEntity } from './field-answer.entity';
import { FieldModule } from 'src/field/field.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([FieldAnswerEntity]),
      FieldModule
    ],
  providers: [FieldAnswerService],
  controllers: [FieldAnswerController],
  exports: [FieldAnswerService]
})
export class FieldAnswerModule {}
