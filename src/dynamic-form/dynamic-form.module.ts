import { Module } from '@nestjs/common';
import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormController } from './dynamic-form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicFormEntity } from './dynamic-form.entity';
import { WaitingPageModule } from 'src/waiting-page/waiting-page.module';
import { FieldModule } from 'src/field/field.module';
import { FieldAnswerModule } from 'src/field-answer/field-answer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DynamicFormEntity]),
    WaitingPageModule, 
    FieldModule,
    FieldAnswerModule
  ],
  controllers: [DynamicFormController],
  providers: [DynamicFormService],
  exports:[ DynamicFormService]
})
export class DynamicFormModule { }
