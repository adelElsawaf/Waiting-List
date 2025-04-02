import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtUserMiddleware implements NestMiddleware {
    private readonly logger = new Logger(JwtUserMiddleware.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            try {
                const decoded = this.jwtService.verify(token);
                const userId = decoded.userId;
                const user = await this.userService.findByIdSafe(userId);
                console.log(user.user)
                if (user) {
                    req['loggedInUser'] = user.user;
                    this.logger.debug(`User attached to request: ${user.user.id}`);
                }
            } catch (err) {
                this.logger.warn('Invalid or expired JWT token');
            }
        }

        next();
    }
}
