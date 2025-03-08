import { Test, TestingModule } from '@nestjs/testing';
import { WaitingPageController } from './waiting-page.controller';

describe('WaitingPageController', () => {
  let controller: WaitingPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitingPageController],
    }).compile();

    controller = module.get<WaitingPageController>(WaitingPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
