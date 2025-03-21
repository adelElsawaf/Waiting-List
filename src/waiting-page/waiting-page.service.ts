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
@Injectable()
export class WaitingPageService {
    constructor(
        @InjectRepository(WaitingPageEntity)
        private readonly waitingPageRepository :Repository<WaitingPageEntity>,
        configService: ConfigService,
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


}
