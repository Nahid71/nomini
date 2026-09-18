import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve /uploads statically from server disk storage
  const uploadsFolder = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsFolder));

  // Enable CORS for Next.js frontend
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // OpenAPI Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Nomini Group API')
    .setDescription(
      'Digital Platform REST API for Agritech E-Commerce, Crowdfarming, Team Kanban Management, and DPP Traceability',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Nomini Backend running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation at http://localhost:${port}/api/docs`);
}

bootstrap();
