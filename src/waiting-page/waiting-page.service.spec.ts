import { Test, TestingModule } from '@nestjs/testing';
import { WaitingPageService } from './waiting-page.service';

describe('WaitingPageService', () => {
  let service: WaitingPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaitingPageService],
    }).compile();

    service = module.get<WaitingPageService>(WaitingPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
