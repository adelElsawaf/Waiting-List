import { forwardRef, Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterRequest } from './request/UserRegisterRequest';
import { UserAlreadyExistException } from 'src/user/exception/UserAlreadyExistException';
import { UserService } from 'src/user/user.service';



@Injectable()
export class AuthService {
    constructor(@Inject(forwardRef(() => UserService)) // Use forwardRef to inject UserService
    private readonly userService: UserService,
        private jwtService: JwtService
    ) { }

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

    async googleLogin(email: string, userId: number) {
        return this.generateToken({ email: email, userId: userId })
    }

    async isPasswordMatch(providedPassword: string, storedPassword: string): Promise<boolean> {
        return bcrypt.compareSync(providedPassword, storedPassword);
    }

    async verifyToken(token: string) {
        const decoded = this.jwtService.verify(token);
        return this.userService.findByEmail(decoded.email);
    }
    async generateToken(payload: any) {
        return { token: this.jwtService.sign(payload) };
    }
}
