import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { DropboxStorageService } from '../dropbox-storage.service';

@Injectable()
export class EnsureTokenInterceptor implements NestInterceptor {
    constructor(private readonly dropboxService: DropboxStorageService) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        await this.dropboxService.ensureValidToken();
        return next.handle();
    }
}
