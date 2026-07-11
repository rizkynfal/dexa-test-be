import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { LoginService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @MessagePattern({ cmd: 'login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const res = await this.loginService.login(loginDto);
    return res;
  }

  @MessagePattern({ cmd: 'register' })
  @Get()
  register(@Body() registerDto: RegisterDto) {
    return this.loginService.register(registerDto);
  }
  @MessagePattern({ cmd: 'refresh' })
  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.loginService.refreshToken(body.refreshToken);
  }
}
