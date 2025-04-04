import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/user.entity';
import { WaitingPageModule } from './waiting-page/waiting-page.module';
import { DropboxStorageModule } from './dropbox-storage/dropbox-storage.module';
import { JwtUserMiddleware } from './auth/middleware/JwtUserMiddleware';
import { WaitingPageEntity } from './waiting-page/waiting-page.entity';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { FieldModule } from './field/field.module';
import { FieldAnswerModule } from './field-answer/field-answer.module';
import { FormSubmissionModule } from './form-submission/form-submission.module';
import { WaitingPageViewLogModule } from './waiting-page-view-log/waiting-page-view-log.module';
import { WaitingPageWithAnalyticsModule } from './waiting-page-with-analytics/waiting-page-with-analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    WaitingPageModule,
    DropboxStorageModule,
    DynamicFormModule,
    FieldModule,
    FieldAnswerModule,
    FormSubmissionModule,
    WaitingPageViewLogModule,
    WaitingPageWithAnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtUserMiddleware).forRoutes('*'); // Apply middleware globally
  }
}
