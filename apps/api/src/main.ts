import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static assets (Showcase Landing Page, Logos, etc.)
  const publicDirCandidates = [
    path.join(__dirname, '..', 'public'),
    path.join(process.cwd(), 'public'),
    path.join(process.cwd(), 'apps', 'api', 'public'),
  ];
  for (const dir of publicDirCandidates) {
    if (fs.existsSync(dir)) {
      app.useStaticAssets(dir);
      break;
    }
  }

  // Global prefix for API endpoints (excluding root landing page, docs and health)
  app.setGlobalPrefix('v1', {
    exclude: ['/', 'health'],
  });

  app.enableCors({ origin: true, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('JaldiWala Quick Commerce Core API')
    .setDescription(
      'Production-oriented own-inventory Quick Commerce Platform API for Noida / Delhi NCR.\n\nIncludes 14-state Order State Machine, FEFO Inventory Concurrency Controls, PostGIS Serviceability, and Indian SMS OTP.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('System', 'Health checks and server metadata')
    .addTag('Authentication', 'OTP login, staff password login and token rotation')
    .addTag('Geography & Serviceability', 'PostGIS geofence checks and dynamic ETA')
    .addTag('Catalog & Products', 'Multi-tier categories and FMCG items')
    .addTag('Orders & State Machine', '14-status lifecycle, atomic reservation and OTP delivery')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  logger.log(`⚡ JaldiWala Core API & Showcase running on: http://0.0.0.0:${port}`);
  logger.log(`📚 Swagger OpenAPI Documentation available on: http://0.0.0.0:${port}/docs`);
}

bootstrap();
