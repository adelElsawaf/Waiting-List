import { Module } from '@nestjs/common';
import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormController } from './dynamic-form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicFormEntity } from './dynamic-form.entity';
import { WaitingPageModule } from 'src/waiting-page/waiting-page.module';
import { FieldModule } from 'src/field/field.module';
import { FieldAnswerModule } from 'src/field-answer/field-answer.module';
import { FormViewLogsModule } from 'src/form-view-logs/form-view-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DynamicFormEntity]),
    WaitingPageModule, 
    FieldModule,
    FieldAnswerModule,
    FormViewLogsModule
  ],
  controllers: [DynamicFormController],
  providers: [DynamicFormService],
  exports:[ DynamicFormService]
})
export class DynamicFormModule { }
