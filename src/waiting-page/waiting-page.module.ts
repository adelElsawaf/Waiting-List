import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitingPageEntity } from './waiting-page.entity';
import { WaitingPageService } from './waiting-page.service';
import { WaitingPageController } from './waiting-page.controller';
import { ConfigModule } from '@nestjs/config';
import { DropboxStorageService } from 'src/dropbox-storage/dropbox-storage.service';
import { DropboxStorageModule } from 'src/dropbox-storage/dropbox-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WaitingPageEntity]),  
    ConfigModule, 
    DropboxStorageModule
  ],
  controllers: [WaitingPageController],
  providers: [WaitingPageService],
  exports: [WaitingPageService],  
})
export class WaitingPageModule { }
