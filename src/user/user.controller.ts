import { Response } from 'express';
import { BadRequestException, Body, Controller, Get, Header, Headers, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService,
    ) { }
    @Get('by-token')
    async getUserFromToken(@Headers('Authorization') token: string) {
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        const jwtToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

        return this.userService.getUserFromToken(jwtToken);
    }

}
