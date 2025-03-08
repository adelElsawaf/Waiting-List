import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';

export const LoggedInUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserEntity | null => {
        const request = ctx.switchToHttp().getRequest();
        return request.loggedInUser || null;
    },
);
