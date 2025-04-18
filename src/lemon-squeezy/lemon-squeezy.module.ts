import { Module } from '@nestjs/common';
import { LemonSqueezyController } from './lemon-squeezy.controller';
import { LemonSqueezyService } from './lemon-squeezy.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [LemonSqueezyController],
    providers: [LemonSqueezyService],
})
export class LemonSqueezyModule { }