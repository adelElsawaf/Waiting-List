import { Module } from '@nestjs/common';
import { DropboxStorageService } from './dropbox-storage.service';
import { DropboxStorageController } from './dropbox-storage.controller';

@Module({
  providers: [DropboxStorageService],
  controllers: [DropboxStorageController],
  exports:[DropboxStorageService]
})
export class DropboxStorageModule {}
