import { Module } from '@nestjs/common';
import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormController } from './dynamic-form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicFormEntity } from './dynamic-form.entity';
import { WaitingPageModule } from 'src/waiting-page/waiting-page.module';
import { FieldModule } from 'src/field/field.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DynamicFormEntity]),
    WaitingPageModule, 
    FieldModule     
  ],
  controllers: [DynamicFormController],
  providers: [DynamicFormService],
})
export class DynamicFormModule { }
