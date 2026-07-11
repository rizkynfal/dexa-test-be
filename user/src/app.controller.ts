import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@Controller({
  version: VERSION_NEUTRAL,
})
@ApiTags('/')
export class AppController {
  constructor() {}
  @Get()
  getHello(): { message: string } {
    return { message: 'Welcome to the WCC API Service' };
  }
}
