import { Test, TestingModule } from '@nestjs/testing';
import { WaitingPageWithAnalyticsController } from './waiting-page-with-analytics.controller';

describe('WaitingPageWithAnalyticsController', () => {
  let controller: WaitingPageWithAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitingPageWithAnalyticsController],
    }).compile();

    controller = module.get<WaitingPageWithAnalyticsController>(WaitingPageWithAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
