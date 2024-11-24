import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterRequest } from './request/UserRegisterRequest';
import { UserAlreadyExistException } from 'src/user/exception/UserAlreadyExistException';
import { UserService } from 'src/user/user.service';



@Injectable()
export class AuthService {
    constructor(private userService: UserService,
        private jwtService: JwtService
    ) { }
    /**
     * Registers a new user and returns a CreateUserResponse.
     * @param userRegisterRequest A UserRegisterRequest object containing the user's email, password, first name, and last name.
     * @throws UserAlreadyExistException if a user with the given email already exists.
     * @returns A CreateUserResponse object containing the newly created user.
     */
    async localRegister(userRegisterRequest: UserRegisterRequest) {
        try {
            return await this.userService.createLocalUser(
                userRegisterRequest.email,
                userRegisterRequest.password,
                userRegisterRequest.firstName,
                userRegisterRequest.lastName,
            )
        } catch (error) {
            if (error instanceof UserAlreadyExistException) {
                throw error;
            }
        }
    }
/**
 * Authenticates a user using their email and password.
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves to an object containing a JWT token if authentication is successful.
 * @throws UnauthorizedException if the password is invalid.
 * @throws UserNotFoundException if no user with the given email is found.
 */
    async localLogin(email: string, password: string): Promise<{ token: string }> {
        try {
            const user = (await this.userService.findByEmail(email)).user;
            if (user.password && await this.isPasswordMatch(password, user.password)) {
                const payload = { email: user.email, userId: user.id };
                return this.generateToken(payload);
            }
            else {
                throw new UnauthorizedException('Invalid Password')
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Handles the Google authentication process.
     * @param userRegisterRequest - The information received from Google.
     * @returns A promise that resolves to an object containing a JWT token if authentication is successful.
     * @throws UnprocessableEntityException if the user that signed up with Google is not the same as the one that
     * already exists in the database.
     */
    async handleGoogleAuth(userRegisterRequest: UserRegisterRequest) {
        try {
            const createdUser = (await this.googleRegister(userRegisterRequest)).user;
            return await this.googleLogin(createdUser.email, createdUser.id)
        }
        catch (error) {
            if (error instanceof UserAlreadyExistException) {
                let user = (await this.userService.findByEmailSafe(userRegisterRequest.email)).user
                if (user.googleId) {
                    return await this.googleLogin(user.email, user.id)
                }
                else {
                    throw new UnprocessableEntityException("User is not signed up with google")
                }
            }
        }
    }
    /**
     * Creates a user from a Google sign-in request.
     * @param userRegisterRequest The information received from Google.
     * @returns A promise that resolves to a CreateUserResponse if the user is created successfully.
     * @throws UserAlreadyExistException if a user with the given email already exists.
     */
    async googleRegister(
        userRegisterRequest: UserRegisterRequest,
    ) {
        return await this.userService.createGoogleUser(
            userRegisterRequest.email,
            userRegisterRequest.googleId,
            userRegisterRequest.firstName,
            userRegisterRequest.lastName,
        );
    }
    /**
     * Generates a JWT token after a successful Google login.
     * @param email The email address of the user.
     * @param userId The ID of the user.
     * @returns A promise that resolves to an object containing a JWT token.
     */
    async googleLogin(email: string, userId: number) {
        return this.generateToken({ email: email, userId: userId })
    }
/**
 * Compares a provided password with a stored hashed password.
 * @param providedPassword - The plain text password provided by the user.
 * @param storedPassword - The hashed password stored in the database.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
    async isPasswordMatch(providedPassword: string, storedPassword: string): Promise<boolean> {
        return bcrypt.compareSync(providedPassword, storedPassword);
    }



    /**
     * Generates a JWT token containing the provided payload.
     * @param payload The payload to be inserted into the JWT token.
     * @returns A promise that resolves to an object containing the JWT token.
     */
    async generateToken(payload: any) {
        return { token: this.jwtService.sign(payload) };
    }
}
