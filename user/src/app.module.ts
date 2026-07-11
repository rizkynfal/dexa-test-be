import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AbsensiModule, UserModule } from '@user/modules';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@user/config';
import { PrismaService } from './lib/prisma/prisma.service';
 
@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: 'debug',
              options: {
                translateTime: true,
                ignore: 'pid,hostname',
                singleLine: true,
                redact: [
                  'req.headers.authorization',
                  'req.body.password',
                  'req.body.confirmPassword',
                  'req.headers.x-user-payload',
                  'req.headers.x-user-signature',
                ],
                colorize: true,
              },
            },
            {
              target: 'pino/file',
              level: 'info',
              options: {
                translateTime: true,
                ignore: 'pid,hostname',
                singleLine: true,
                redact: [
                  'req.headers.authorization',
                  'req.body.password',
                  'req.body.confirmPassword',
                  'req.headers.x-user-payload',
                  'req.headers.x-user-signature',
                ],
                destination: 'logs/info.log',
                mkdir: true,
                sync: false,
              },
            },
            {
              target: 'pino/file',
              level: 'error',
              options: {
                translateTime: true,
                ignore: 'pid,hostname',
                singleLine: true,
                redact: [
                  'req.headers.authorization',
                  'req.body.password',
                  'req.body.confirmPassword',
                  'req.headers.x-user-payload',
                  'req.headers.x-user-signature',
                ],
                destination: 'logs/error.log',
                mkdir: true,
                sync: false,
              },
            },
          ],
        },
      },
      exclude: [{ method: RequestMethod.ALL, path: 'docs' }],
    }),
    AbsensiModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure() {}
}
 