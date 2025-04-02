import { Module } from '@nestjs/common';
import { FormSubmissionService } from './form-submission.service';
import { FormSubmissionController } from './form-submission.controller';
import { DynamicFormModule } from 'src/dynamic-form/dynamic-form.module';
import { FieldAnswerEntity } from 'src/field-answer/field-answer.entity';
import { FieldAnswerModule } from 'src/field-answer/field-answer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormSubmissionEntity } from './form-submission.entity';

@Module({
  providers: [FormSubmissionService],
  controllers: [FormSubmissionController],
  imports: [TypeOrmModule.forFeature([FormSubmissionEntity]),
    DynamicFormModule,
    FieldAnswerModule],
})
export class FormSubmissionModule {}
