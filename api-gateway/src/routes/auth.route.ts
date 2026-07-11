import { Controller, Get, Param, Inject, Post, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICES_CONFIG } from '../config';
import { serviceCall } from 'src/lib/microservice.util';
import { LoginDto } from '@gateway/dtos';
const serviceConfig = SERVICES_CONFIG;
@Controller('auth')
export class AuthControllerGateway {
  constructor(
    @Inject(serviceConfig.AUTH.NAME) private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const pattern = { cmd: 'login' };
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return await serviceCall(this.authClient.send(pattern, dto));
  }

  @Post('refresh')
  async refresh(@Body() refreshToken: string) {
    const pattern = { cmd: 'refresh' };
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return await serviceCall(this.authClient.send(pattern, refreshToken));
  }
}
