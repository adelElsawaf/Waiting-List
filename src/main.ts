import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const frontEndUrl = configService.get<string>('FRONT_END_URL');

  app.enableCors({
    origin: frontEndUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  console.log('CORS enabled for:', frontEndUrl);

  app.use(cookieParser());

  // 🧠 IMPORTANT: Use raw body parser BEFORE starting the server
  app.use('/lemon-squeezy/webhook', express.raw({ type: 'application/json' }));

  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
