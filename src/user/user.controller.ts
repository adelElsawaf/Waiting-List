import { Response } from 'express';
import { Body, Controller, Get, Header, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

}
