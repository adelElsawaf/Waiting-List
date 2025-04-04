import { Test, TestingModule } from '@nestjs/testing';
import { WaitingPageWithAnalyticsService } from './waiting-page-with-analytics.service';

describe('WaitingPageWithAnalyticsService', () => {
  let service: WaitingPageWithAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaitingPageWithAnalyticsService],
    }).compile();

    service = module.get<WaitingPageWithAnalyticsService>(WaitingPageWithAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
