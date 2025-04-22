import { Injectable, BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository, Transaction } from 'typeorm';
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
import { User } from 'src/user/response/User';
import { UserService } from 'src/user/user.service';
@Injectable()
export class WaitingPageService {
    private pageCost;
    constructor(
        @InjectRepository(WaitingPageEntity)
        private readonly waitingPageRepository :Repository<WaitingPageEntity>,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private  dropboxStorageService: DropboxStorageService,
        private readonly dataSource: DataSource,
    ) { 
        this.pageCost = this.configService.get<number>('PAGE_COST');
    }
    
    async createWaitingPage(
        user: UserEntity,
        dto: CreateWaitingPageDto,
    ): Promise<CreateWaitingPageResponseDTO> {
        const userWaitingPages = await this.getUserFreeWaitingPages(user);

        if (dto.isFree && userWaitingPages.length >= 5) {
            throw new BadRequestException('User already has 5 free waiting pages');
        }
        if(!dto.isFree && user.credits < this.pageCost) {
            throw new UnprocessableEntityException('User does not have enough credits');
        }

        const backgroundImgUrl = await this.dropboxStorageService.upload(dto.backgroundImg);
        const uniqueSlug = await this.generateUniqueSlug(dto.title);
        const shareableURL = await this.generateShareablePageURL(uniqueSlug);

        const savedWaitingPage = await this.dataSource.transaction(
            async (manager: EntityManager) => {
                if (!dto.isFree) {
                    await this.userService.decrementUserCreditTransactional(
                        user.id,
                        this.pageCost,
                        manager,
                    );
                }
                const waitingPage = this.waitingPageRepository.create({
                    ...dto,
                    backgroundImgUrl,
                    generatedTitle: uniqueSlug,
                    owner: user,
                    isFree: dto.isFree,
                    shareableUrl: shareableURL
                });
                return await manager.save(WaitingPageEntity, waitingPage);
            },
        );

        return CreateWaitingPageResponseDTO.fromEntity(savedWaitingPage);
    }


    async getUserFreeWaitingPages(user: UserEntity): Promise<WaitingPageEntity[]> {
        return this.waitingPageRepository.find({
            where: { owner: { id: user.id } , isFree: true },
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
        return GetWaitingPageResponseDTO.fromEntity(waitingPage);
    }

    async getAllWaitingPages(user: UserEntity): Promise<GetWaitingPageResponseDTO[]> {
        const waitingPages = await this.waitingPageRepository.find({
            where: { owner: user },
            order: { id: 'DESC' },
        });
        return waitingPages.map(page => {
            return GetWaitingPageResponseDTO.fromEntity(page);
        });
    }


    async generateShareablePageURL(uniqueTitle: string): Promise<string> {
    const frontendBaseUrl = this.configService.get<string>('FRONT_END_URL');
    if (!frontendBaseUrl) {
        throw new Error('FRONTEND_BASE_URL is not defined in environment variables.');
    }

    return `${frontendBaseUrl}/waiting-page/${uniqueTitle}`;
}
   
}

