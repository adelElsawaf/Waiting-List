import { Test, TestingModule } from '@nestjs/testing';
import { DropboxStorageController } from './dropbox-storage.controller';

describe('DropboxStorageController', () => {
  let controller: DropboxStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DropboxStorageController],
    }).compile();

    controller = module.get<DropboxStorageController>(DropboxStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
