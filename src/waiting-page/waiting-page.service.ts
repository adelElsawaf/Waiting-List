import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { WaitingPageEntity } from './waiting-page.entity';
import { UserEntity } from 'src/user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateWaitingPageDto } from './request/CreateWaitingPageDTO';
import { ConfigService } from '@nestjs/config';
import slugify from 'slugify';
import { use } from 'passport';
import { CreateWaitingPageResponseDTO } from './response/CreateWaitingPageResponseDTO';
import { DropboxStorageService } from 'src/dropbox-storage/dropbox-storage.service';
import GetWaitingPageResponseDTO from './response/GetWaitingPageResponseDTO';
@Injectable()
export class WaitingPageService {
    constructor(
        @InjectRepository(WaitingPageEntity)
        private readonly waitingPageRepository :Repository<WaitingPageEntity>,
        private readonly configService: ConfigService,
        private  dropboxStorageService: DropboxStorageService
    ) { }
    
    async createWaitingPage(user: UserEntity, dto: CreateWaitingPageDto): Promise<CreateWaitingPageResponseDTO> {
        const userWaitingPages = await this.getUserWaitingPages(user);
        if (userWaitingPages.length >= 5) {
            throw new BadRequestException('User already has 5 waiting pages');
        }
        const uniqueSlug = await this.generateUniqueSlug(dto.title);
        const backgroundImgUrl = await this.dropboxStorageService.upload(dto.backgroundImg);
        const waitingPage = this.waitingPageRepository.create({
            ...dto,
            backgroundImgUrl: backgroundImgUrl,
            generatedTitle: uniqueSlug,
            owner: user
        });
        const savedWaitingPage = await this.waitingPageRepository.save(waitingPage);
        return CreateWaitingPageResponseDTO.fromEntity(savedWaitingPage);
    }

    async getUserWaitingPages(user: UserEntity): Promise<WaitingPageEntity[]> {
        return this.waitingPageRepository.find({
            where: { owner: { id: user.id } },
            order: { id: 'DESC' },
        });
    }

    async generateUniqueSlug(title: string): Promise<string> {
        const shortUUID = uuidv4().slice(0, 8);
        const baseSlug = slugify(title, { lower: true, strict: true });
        return `${baseSlug}-${shortUUID}`;
    }
    async getWaitingPageByIdAsEntity(id: number): Promise<WaitingPageEntity> {
        return await this.waitingPageRepository.findOne({
            where: { id },
            relations: ['owner'], // ✅ This will load the owner
        });
    }

    async getWaitingPageByUniqueTitle(title: string,
        loggedInUser?: UserEntity,
       
    ): Promise<GetWaitingPageResponseDTO> {
        let waitingPage: WaitingPageEntity | null = null;
        if (loggedInUser) {
            // 🔹 Define behavior for logged-in users
            // Example: Fetch waiting page only if user is the owner
            waitingPage = await this.waitingPageRepository.findOne({
                where: { generatedTitle: title, owner: loggedInUser },
                relations: [
                    "form",
                    "form.fields",
                    "form.submissions",
                    "form.submissions.answers",
                    "form.submissions.answers.field",
                ],
            });
        } else {
            // 🔹 Fetch without owner filter for non-logged-in users
            waitingPage = await this.waitingPageRepository.findOne({
                where: { generatedTitle: title },
                relations: [
                    "form",
                    "form.fields",
                ]
            });
        }

        if (!waitingPage) {
            throw new Error(`Waiting page with title '${title}' not found`);
        }
        const shareableUrl = this.generateShareablePageURL(title)
        return GetWaitingPageResponseDTO.fromEntity(waitingPage,shareableUrl);
    }

    async getAllWaitingPages(user: UserEntity): Promise<GetWaitingPageResponseDTO[]> {
        const waitingPages = await this.waitingPageRepository.find({
            where: { owner: user },
            order: { id: 'DESC' },
        });
        return waitingPages.map(page => {
            const shareableURL = this.generateShareablePageURL(page.generatedTitle);
            return GetWaitingPageResponseDTO.fromEntity(page, shareableURL);
        });
    }

     generateShareablePageURL(uniqueTitle: string): string {
        const frontendBaseUrl = this.configService.get<string>('FRONT_END_URL');
        if (!frontendBaseUrl) {
            throw new Error('FRONTEND_BASE_URL is not defined in environment variables.');
        }

        return `${frontendBaseUrl}/waiting-page/${uniqueTitle}`;
    }
}
