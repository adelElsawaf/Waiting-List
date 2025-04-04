import { Test, TestingModule } from '@nestjs/testing';
import { WaitingPageViewLogController } from './waiting-page-view-log.controller';

describe('WaitingPageViewLogController', () => {
  let controller: WaitingPageViewLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitingPageViewLogController],
    }).compile();

    controller = module.get<WaitingPageViewLogController>(WaitingPageViewLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
