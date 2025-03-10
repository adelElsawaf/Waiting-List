import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { DropboxStorageService } from '../dropbox-storage.service';

@Injectable()
export class EnsureTokenInterceptor implements NestInterceptor {
    constructor(private readonly dropboxService: DropboxStorageService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return from(this.dropboxService.refreshAccessToken()).pipe(() => next.handle());
    }
}
