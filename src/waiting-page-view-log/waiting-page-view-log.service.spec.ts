import { Test, TestingModule } from '@nestjs/testing';
import { WaitingPageViewLogService } from './waiting-page-view-log.service';

describe('WaitingPageViewLogService', () => {
  let service: WaitingPageViewLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaitingPageViewLogService],
    }).compile();

    service = module.get<WaitingPageViewLogService>(WaitingPageViewLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
