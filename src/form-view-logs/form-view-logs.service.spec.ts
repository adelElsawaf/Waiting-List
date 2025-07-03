import { Test, TestingModule } from '@nestjs/testing';
import { FormViewLogsService } from './form-view-logs.service';

describe('FormViewLogsService', () => {
  let service: FormViewLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormViewLogsService],
    }).compile();

    service = module.get<FormViewLogsService>(FormViewLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
