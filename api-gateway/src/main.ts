import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { APP_CONFIG } from './config';
import * as dotenv from 'dotenv';
import { AllExceptionsFilter } from '@gateway/lib';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
dotenv.config();
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

const logger = new Logger();
const appConfig = APP_CONFIG;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ methods, maxAge: 3600, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.map((err) => ({
            field: err.property,
            message: Object.values(err.constraints ?? {})[0],
          })),
        });
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  await app.listen(appConfig.PORT);
  logger.log(`🚀 API Gateway running on port ${appConfig.PORT}`);
}
bootstrap();
