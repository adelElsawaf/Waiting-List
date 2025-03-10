import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { EnsureTokenInterceptor } from '../interceptor/🛠 ensure-token.interceptor';

export function EnsureToken() {
    return applyDecorators(UseInterceptors(EnsureTokenInterceptor));
}
