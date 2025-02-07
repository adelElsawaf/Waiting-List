import { Controller, Post, Body, Get, Req, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserRegisterRequest } from './request/UserRegisterRequest'; // Assuming your DTO is in a `dto` folder
import { GoogleAuthGuard } from './guards/google.guard';
import { LoginRequest } from './request/LoginRequest';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) { }
    /**
     * Logs in a user using their email and password.
     * @param loginRequest A LoginRequest object containing the email and password.
     * @returns A promise that resolves to an object containing a JWT token if the login is successful.
     * @throws UnauthorizedException if the password is invalid.
     * @throws UserNotFoundException if no user with the given email is found.
    */
    @Post("login")
    async login(@Body() loginRequest: LoginRequest) {
        return await this.authService.localLogin(loginRequest.email, loginRequest.password);
    }

    /**
     * Registers a new user with the provided email and password.
     * @param userRegisterRequest A UserRegisterRequest object containing the email and password.
     * @returns A promise that resolves to a CreateUserResponse if the registration is successful.
     * @throws UserAlreadyExistException if the user already exists.
     */
    @Post('register')
    async register(@Body() userRegisterRequest: UserRegisterRequest) {
        console.log(userRegisterRequest)
        return await this.authService.localRegister(userRegisterRequest);
    }

    /**
     * Initiates the Google OAuth process.
     * The user will be redirected to Google's login page for authentication.
     */
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() { }


    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const { token } = await this.authService.handleGoogleAuth(req.user);
        res.cookie('access_token', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            maxAge: 3600 * 1000, 
            domain:".railway.app"
        });
        res.redirect(this.configService.get<string>('FRONT_END_URL'));
    }

    @Get('verify')
    async verifyAuth(@Req() req, @Res() res: Response) {
        try {
            // Get token from cookie
            const token = req.cookies['auth_token'];

            if (!token) {
                return res.status(401).json({ message: 'No token found' });
            }

            const userData = await this.authService.verifyToken(token);
            return res.json({ user: userData });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}
