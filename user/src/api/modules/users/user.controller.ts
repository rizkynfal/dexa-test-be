import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @MessagePattern({ cmd: 'get_user_list' })
  @Get()
  getUser() {
    return this.userService.getUser();
  }
  @MessagePattern({ cmd: 'get_role_list' })
  @Get()
  getRoleList() {
    return this.userService.getRoleList();
  }
  @MessagePattern({ cmd: 'create_user' })
  @Post()
  createUser(@Payload() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }
  @MessagePattern({ cmd: 'update_user' })
  @Patch()
  updateUser(@Payload() payload: { id: string; dto: UpdateUserDto }) {
    return this.userService.updateUser(payload.id, payload.dto);
  }
  @MessagePattern({ cmd: 'delete_user' })
  @Get(':id')
  deleteUser(@Payload() id: string) {
    return this.userService.deleteUser(id);
  }
}
