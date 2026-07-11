import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { APP_CONFIG, SERVICES_CONFIG } from './config';
import {
  UserControllerGateway,
  AuthControllerGateway,
  AttendanceControllerGateway,
} from '@gateway/routes';
import { JwtAuthMiddleware } from './middlewares';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
const servicesConfig = SERVICES_CONFIG;
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<number>('JWT_EXPIRE', 14400) },
      }),
    }),
    ClientsModule.register([
      {
        name: servicesConfig.USER.NAME,
        transport: Transport.TCP,
        options: {
          host: servicesConfig.USER.HOST,
          port: servicesConfig.USER.PORT,
        },
      },
      {
        name: servicesConfig.AUTH.NAME,
        transport: Transport.TCP,
        options: {
          host: servicesConfig.AUTH.HOST,
          port: servicesConfig.AUTH.PORT,
        },
      },
      {
        name: servicesConfig.ATTENDANCE.NAME,
        transport: Transport.TCP,
        options: {
          host: servicesConfig.ATTENDANCE.HOST,
          port: servicesConfig.ATTENDANCE.PORT,
        },
      },
    ]),
  ],
  providers: [JwtAuthMiddleware, JwtService],
  controllers: [
    AppController,
    UserControllerGateway,
    AuthControllerGateway,
    AttendanceControllerGateway,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(
        { path: 'docs', method: RequestMethod.ALL },
        { path: '/', method: RequestMethod.GET },
        { path: '/auth/login', method: RequestMethod.POST },
      )
      .forRoutes('{*verify}');
  }
}
