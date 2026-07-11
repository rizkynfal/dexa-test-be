import { Module } from '@nestjs/common';
import { LoginController } from './auth.controller';
import { LoginService } from './auth.service';
import { PrismaService } from '@auth/lib';
import { JwtService } from '@nestjs/jwt';
import { DatabaseConfig, JWTConfig } from '@auth/config';

@Module({
  imports: [JWTConfig, DatabaseConfig],
  controllers: [LoginController],
  providers: [LoginService, PrismaService, JwtService, ],
})
export class AuthModule {}
