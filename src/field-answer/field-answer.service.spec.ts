import { Test, TestingModule } from '@nestjs/testing';
import { FieldAnswerService } from './field-answer.service';

describe('FieldAnswerService', () => {
  let service: FieldAnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldAnswerService],
    }).compile();

    service = module.get<FieldAnswerService>(FieldAnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
