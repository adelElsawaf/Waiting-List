import { Test, TestingModule } from '@nestjs/testing';
import { FormViewLogsController } from './form-view-logs.controller';

describe('FormViewLogsController', () => {
  let controller: FormViewLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormViewLogsController],
    }).compile();

    controller = module.get<FormViewLogsController>(FormViewLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
