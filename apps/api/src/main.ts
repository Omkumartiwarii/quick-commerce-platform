import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
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
    .setTitle('Quick Commerce Core API (Zepto/Blinkit Architecture)')
    .setDescription(
      'Production-oriented own-inventory Quick Commerce Platform API for Noida / Delhi NCR.\n\nIncludes 14-state Order State Machine, FEFO Inventory Concurrency Controls, PostGIS Serviceability, and Indian SMS OTP.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication', 'OTP login, staff password login and token rotation')
    .addTag('Geography & Serviceability', 'PostGIS geofence checks and dynamic ETA')
    .addTag('Catalog & Products', 'Multi-tier categories and FMCG items')
    .addTag('Orders & State Machine', '14-status lifecycle, atomic reservation and OTP delivery')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`⚡ Quick Commerce Core API running on: http://localhost:${port}/v1`);
  logger.log(`📚 Swagger OpenAPI Documentation available on: http://localhost:${port}/docs`);
}

bootstrap();
