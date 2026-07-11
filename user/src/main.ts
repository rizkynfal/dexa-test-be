import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { AppConfig } from '@user/config';
import { join } from 'path';
import { SwaggerSetup } from '@user/lib';

dotenv.config();

async function bootstrap() {
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfig);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: appConfig.servicePort,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(process.cwd(), 'proto', 'user.proto'),
      url: '0.0.0.0:5001', // Attendance service connects here
    },
  });
  const logger = new Logger(`${appConfig.name}`);
  app.enableCors({ methods, maxAge: 3600, credentials: true });
  SwaggerSetup(app, appConfig);
  await app.startAllMicroservices();
  appConfig.env != 'production' ? await app.listen(appConfig.port) : null;
  logger.log(`==========================================================`);
  logger.log(`🚀 Application is running on: ${appConfig.appUrl}`);
  logger.log(`🚀 Swagger is running on: ${appConfig.appUrl}/docs`);
}
bootstrap();
