import { Request, Response } from 'express';
import { BadRequestException, Body, Controller, Get, Header, Headers, HttpStatus, Param, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService,
    ) { }
    @Get('by-token')
    async getUserFromToken(@Req() req: Request, @Res() res: Response) {
        const token = req.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException('Authorization token is missing');
        }

        const user = await this.userService.getUserFromToken(token);
        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }
        console.log(user)
        return res.json(user);
    }
}
