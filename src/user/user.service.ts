import { Injectable, Inject, forwardRef, BadRequestException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { CreateUserResponse } from './response/CreateUserResponse';
import { UserAlreadyExistException } from './exception/UserAlreadyExistException';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { FindUserResponse } from './response/FindUserResponse';
import { User } from './response/User';
import { AuthService } from 'src/auth/auth.service';
import GetWaitingPageResponseDTO from 'src/waiting-page/response/GetWaitingPageResponseDTO';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @Inject(forwardRef(() => AuthService)) 
        private readonly authService: AuthService,
    ) { }

    async createLocalUser(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ): Promise<CreateUserResponse> {

        const existingUser = await this.findByEmailSafe(email) // Avoid exception if user not found
        if (existingUser) {
            throw new UserAlreadyExistException(`User with email ${email} already exists`);
        }
        else {

            const hashedPassword = await bcrypt.hash(password, 10);

            const createdUser = await this.userRepository.save({
                email,
                password: hashedPassword,
                firstName,
                lastName,
            });

            const response: CreateUserResponse = {
                user: await this.mapToUser(createdUser)
            };
            return response
        }
    }
    async createGoogleUser(
        email: string,
        googleId: string,
        firstName: string,
        lastName: string,
    ): Promise<CreateUserResponse> {

        const foundUserByEmail = await this.findByEmailSafe(email)
        if (foundUserByEmail) {
            throw new UserAlreadyExistException(`User with email ${email} already exist`);
        }

        const createdUser = await this.userRepository.save({
            email,
            googleId,
            firstName,
            lastName,
        });

        const createdUserResponse: User = {
            id: createdUser.id,
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            googleId: createdUser.googleId,
            credits: createdUser.credits,
        }
        const response: CreateUserResponse = {
            user: createdUserResponse
        };
        return response;
    }

    async findByEmail(email: string): Promise<FindUserResponse> {

        const foundUser = await this.userRepository.findOne({
            where: { email },
            relations: ["waitingPages"]
        })     
        if (!foundUser)
            throw new UserNotFoundException(`No User with email ${email} is found`)

        const response: FindUserResponse = {
            user: await this.mapToUser(foundUser),
        }
        return response;
    }
     async findByEmailSafe(email: string): Promise<FindUserResponse | null> {
        const foundUser = await this.userRepository.findOne({ 
            where: { email },
            relations: ["waitingPages"]
        })

        if (!foundUser) {
            return null; 
        }
       
        const response: FindUserResponse = {
            user: await this.mapToUser(foundUser),
        }
        return response;
    }
    private async mapToUser(userAsEntity?: UserEntity): Promise<User> {
        const user: User = {
            id: userAsEntity.id,
            email: userAsEntity.email,
            password: userAsEntity.password,
            firstName: userAsEntity.firstName,
            lastName: userAsEntity.lastName,
            googleId: userAsEntity.googleId,
            credits: userAsEntity.credits,
            waitingPages : userAsEntity.waitingPages ? GetWaitingPageResponseDTO.fromEntities(userAsEntity.waitingPages) : null
        }
        return user
    }

    async getUserFromToken(token: string): Promise<FindUserResponse> {
       return this.authService.verifyToken(token);
    }

    async findByIdSafe(id: number): Promise<FindUserResponse | null> {
       
        const foundUser = await this.userRepository.findOne({ where: { id } })
        if (!foundUser) {
            return null; 
        }
        const response: FindUserResponse = {
            user: await this.mapToUser(foundUser),
        }
        return response;
    }
  async  findByIdAsEntity(id: number): Promise<UserEntity> {
        const foundUser = await this.userRepository.findOne({ where: { id } })
        if (!foundUser)
            throw new UserNotFoundException(`No User with email ${id} is found`)
        return foundUser;
    }

    async incrementUserCredit(userId: number, credit: number) {
        const user = await this.findByIdAsEntity(userId);
        user.credits += credit;
        await this.userRepository.save(user);
        
    }
    async decrementUserCreditTransactional(
        userId: number,
        amount: number,
        manager: EntityManager,
    ): Promise<void> {
        const user = await manager.findOne(UserEntity, {
            where: { id: userId },
            lock: { mode: 'pessimistic_write' },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (user.credits < amount) {
            throw new BadRequestException('Insufficient credits');
        }

        user.credits -= amount;
        await manager.save(UserEntity, user);
    }

}
