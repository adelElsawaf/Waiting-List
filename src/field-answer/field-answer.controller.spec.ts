import { Test, TestingModule } from '@nestjs/testing';
import { FieldAnswerController } from './field-answer.controller';

describe('FieldAnswerController', () => {
  let controller: FieldAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldAnswerController],
    }).compile();

    controller = module.get<FieldAnswerController>(FieldAnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
