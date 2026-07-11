import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { AppConfig } from '@attendance/config';
import { join } from 'path';
import { SwaggerSetup } from '@attendance/lib';

dotenv.config();

async function bootstrap() {
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfig);
  SwaggerSetup(app, appConfig);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: appConfig.servicePort,
    },
  });
  const logger = new Logger(`${appConfig.name}`);
  app.enableCors({ methods, maxAge: 3600, credentials: true });
  await app.startAllMicroservices();
  appConfig.env != 'production' ? await app.listen(appConfig.port) : null;
  logger.log(`==========================================================`);
  logger.log(`🚀 Application is running on: ${appConfig.appUrl}`);
  logger.log(`🚀 Swagger is running on: ${appConfig.appUrl}/docs`);
}
bootstrap();
