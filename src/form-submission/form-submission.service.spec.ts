import { Test, TestingModule } from '@nestjs/testing';
import { FormSubmissionService } from './form-submission.service';

describe('FormSubmissionService', () => {
  let service: FormSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormSubmissionService],
    }).compile();

    service = module.get<FormSubmissionService>(FormSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
