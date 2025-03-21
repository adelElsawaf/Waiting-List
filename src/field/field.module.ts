import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldEntity } from './field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FieldEntity]),
  ],
  providers: [FieldService],
  controllers: [FieldController],
  exports: [FieldService],
})
export class FieldModule {}
