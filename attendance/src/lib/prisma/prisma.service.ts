import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { DatabaseConfig } from '@attendance/config';
import fs from 'fs';
import { PrismaClient } from '@generated/prisma/client';
@Injectable() 
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(dbConfig: DatabaseConfig) {
    const adapter = new PrismaMariaDb({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.name,
      ssl: {
        ca: fs.readFileSync('./certs/ca.pem'),
        rejectUnauthorized: true,
      },
    });

    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to MariaDB');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from MariaDB');
  }
}
