import {
  Controller,
  Get,
  Param,
  Inject,
  Patch,
  Body,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICES_CONFIG } from '../config';
import { serviceCall } from 'src/lib/microservice.util';
import { CreateUserDto, UpdateUserDto } from '@gateway/dtos';
import { AuthGuard } from '@nestjs/passport';
const serviceConfig = SERVICES_CONFIG;
@Controller('user')
export class UserControllerGateway {
  constructor(
    @Inject(serviceConfig.USER.NAME) private readonly userClient: ClientProxy,
  ) {}

  @Get()
  async getUser() {
    const pattern = { cmd: 'get_user_list' };
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return serviceCall(this.userClient.send(pattern, ''));
  }
  @Get('role')
  async getRoleList() {
    const pattern = { cmd: 'get_role_list' };
    return serviceCall(this.userClient.send(pattern, ''));
  }
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const pattern = { cmd: 'create_user' };
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return serviceCall(this.userClient.send(pattern, dto));
  }
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const pattern = { cmd: 'update_user' };
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return serviceCall(this.userClient.send(pattern, { id, dto }));
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    console.log(id);
    const pattern = { cmd: 'delete_user' };
    // send() returns an RxJS Observable. Converted to a Promise using firstValueFrom.
    return serviceCall(this.userClient.send(pattern, id));
  }
}
