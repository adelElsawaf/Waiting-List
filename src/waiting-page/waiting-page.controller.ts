import { BadRequestException, Body, Controller, Post, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoggedInUser } from 'src/user/decorator/loggedInUser';
import { UserEntity } from 'src/user/user.entity';
import { CreateWaitingPageDto } from './request/CreateWaitingPageDTO';
import { WaitingPageService } from './waiting-page.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateWaitingPageResponseDTO } from './response/CreateWaitingPageResponseDTO';

@Controller('waiting-page')
export class WaitingPageController {
    constructor(private readonly waitingPageService: WaitingPageService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor("file")) // ✅ Extract file from multipart request
    async create(
        @LoggedInUser() user: UserEntity,
        @UploadedFile() backgroundImg: Express.Multer.File, // ✅ Extracts file
        @Body() dto: CreateWaitingPageDto // ✅ Extracts form fields
    ): Promise<CreateWaitingPageResponseDTO> {
        if (!user) {
            throw new BadRequestException('You must be logged in to create a waiting page');
        }

        // ✅ Attach file to DTO
        const dtoWithFile: CreateWaitingPageDto = { ...dto, backgroundImg };

        return this.waitingPageService.createWaitingPage(user, dtoWithFile);
    }
}
