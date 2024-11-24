import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterRequest } from './request/UserRegisterRequest'; // Assuming your DTO is in a `dto` folder
import { GoogleAuthGuard } from './guards/google.guard';
import { LoginRequest } from './request/LoginRequest';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
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
        return await this.authService.localRegister(userRegisterRequest);
    }

    /**
     * Initiates the Google OAuth process.
     * The user will be redirected to Google's login page for authentication.
     */
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // This route initiates the Google OAuth process.
        // Passport will redirect the user to Google's login page.
    }


    /**
     * The route that Google redirects to after a successful authentication.
     * This route will receive the user information from Google and create a JWT token.
     * The JWT token will then be returned to the user.
     * 
     * @returns A promise that resolves to an object containing a JWT token if authentication is successful.
     */
    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async googleAuthCallback(@Req() req) {
        const user = req.user;
        return this.authService.handleGoogleAuth(user);
    }
}
