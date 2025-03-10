import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DropboxStorageService } from './dropbox-storage.service';
import { EnsureToken } from './decorator/🛠 ensure-valid-token.decorator';

@Controller('dropbox-storage')
export class DropboxStorageController {
    constructor(private readonly dropboxStorageService: DropboxStorageService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @EnsureToken()
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const downloadableUrl = await this.dropboxStorageService.upload(file);
        return { downloadableUrl };
    }

}
