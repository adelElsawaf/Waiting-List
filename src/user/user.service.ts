import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { CreateUserResponse } from './response/CreateUserResponse';
import { UserAlreadyExistException } from './exception/UserAlreadyExistException';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { FindUserResponse } from './response/FindUserResponse';
import { User } from './response/User';

@Injectable()
export class UserService {

    /**
     * The constructor for the UsersService.
     * @param userRepository The repository for the UserEntity.
     */
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    /**
     * Creates a local user.
     * @param email The email address of the user.
     * @param password The password of the user.
     * @param firstName The first name of the user.
     * @param lastName The last name of the user.
     * @returns A promise that resolves to a CreateUserResponse if the user was created successfully.
     * @throws UserAlreadyExistException if a user with the given email already exists.
     */
    async createLocalUser(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ): Promise<CreateUserResponse> {
        /**
        * Check first if user exist before adding it
        */
        const existingUser = await this.findByEmailSafe(email) // Avoid exception if user not found
        console.log(existingUser)
        if (existingUser) {
            console.log("exception")
            throw new UserAlreadyExistException(`User with email ${email} already exists`);
        }
        else {
            /**
             * Hashing password for security
             */
            const hashedPassword = await bcrypt.hash(password, 10);
            /**
             * Create new User in db
             */
            const createdUser = await this.userRepository.save({
                email,
                password: hashedPassword,
                firstName,
                lastName,
            });

            /**
             * Building response
             */
            const response: CreateUserResponse = {
                user: await this.mapToUser(createdUser)
            };
            return response
        }
    }
    /**
     * Create a user from a Google sign-in request.
     * @param email The email address of the user.
     * @param googleId The Google ID of the user.
     * @param firstName The first name of the user.
     * @param lastName The last name of the user.
     * @returns A promise that resolves to a CreateUserResponse if successful.
     * @throws UserAlreadyExistException if a user with the given email already exists.
     */
    async createGoogleUser(
        email: string,
        googleId: string,
        firstName: string,
        lastName: string,
    ): Promise<CreateUserResponse> {
        /**
         * Check first if user exist before adding it
         */
        const foundUserByEmail = await this.findByEmailSafe(email)
        if (foundUserByEmail) {
            throw new UserAlreadyExistException(`User with email ${email} already exist`);
        }
        /**
         * Create new User in database
         */
        const createdUser = await this.userRepository.save({
            email,
            googleId,
            firstName,
            lastName,
        });
        /**
       * Building response
       */
        const createdUserResponse: User = {
            id: createdUser.id,
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            googleId: createdUser.googleId
        }
        const response: CreateUserResponse = {
            user: createdUserResponse
        };
        return response;
    }
    /**
     * Finds a user by their email address.
     * @param email - The email address of the user to find.
     * @returns A promise that resolves to the UserEntity if found.
     * @throws UserNotFoundException if no user with the given email is found.
     */
    async findByEmail(email: string): Promise<FindUserResponse> {
        /**
         * Getting User from DB
         */
        const foundUser = await this.userRepository.findOne({ where: { email } })
        if (!foundUser)
            throw new UserNotFoundException(`No User with email ${email} is found`)
        /**
         * Building response 
         */
        const response: FindUserResponse = {
            user: await this.mapToUser(foundUser),
        }
        return response;
    }
    /**
     * Finds a user by their email address.
     * @param email - The email address of the user to find.
     * @returns A promise that resolves to the UserEntity if found, or null if no user with the given email is found.
     */
    async findByEmailSafe(email: string): Promise<FindUserResponse | null> {
        /**
        * Getting User from DB
        */
        const foundUser = await this.userRepository.findOne({ where: { email } })
        if (!foundUser) {
            return null; // Return null if user is not found
        }
        /**
         * Building response 
         */
        const response: FindUserResponse = {
            user: await this.mapToUser(foundUser),
        }
        return response;
    }
    /**
     * Maps a UserEntity to a User.
     * @param UserAsEntity The UserEntity to map.
     * @returns A promise that resolves to the mapped User.
     */
    private async mapToUser(userAsEntity?: UserEntity): Promise<User> {
        const user: User = {
            id: userAsEntity.id,
            email: userAsEntity.email,
            password: userAsEntity.password,
            firstName: userAsEntity.firstName,
            lastName: userAsEntity.lastName,
            googleId: userAsEntity.googleId
        }
        console.log(user)
        return user
    }

}
