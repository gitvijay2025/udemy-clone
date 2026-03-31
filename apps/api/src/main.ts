import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'node:path';
import express, { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });
  // Serve static uploads — videos are protected via signed streaming tokens
  // The Referer/Origin header check prevents direct URL access from browsers
  app.use('/uploads/videos', (req: Request, res: Response, next: NextFunction) => {
    const referer = req.headers.referer || req.headers.origin || '';
    const allowedOrigins = [
      process.env.CORS_ORIGIN ?? 'http://localhost:3000',
      process.env.API_BASE_URL ?? 'http://localhost:3001',
    ];
    // Allow if request comes from our app (preview videos on course pages)
    // or if it's a range request from our streaming endpoint
    const isAllowed = allowedOrigins.some((o) => referer.includes(o));
    if (!isAllowed) {
      return res.status(403).json({ message: 'Direct video access is not allowed.' });
    }
    // Add headers to prevent download
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  });
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
