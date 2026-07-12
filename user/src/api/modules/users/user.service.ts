import { generatePassword, hashPassword, PrismaService } from '@user/lib';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppException } from '@user/common';
import { CreateUserDto } from './dto/create-user.dto';
import { uuidv7 } from 'uuidv7';
@Injectable()
export class UserService {
  constructor(private readonly prismaApp: PrismaService) {}
  async getUser() {
    return await this.prismaApp.users.findMany({
      include: {
        role: true,
      },
    });
  }
  async createUser(dto: CreateUserDto) {
    const { email, name, phoneNumber, posisi, roleId } = dto;
    const user = await this.prismaApp.users.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      throw new AppException(
        400,
        'EMAIL_ALREADY_EXISTS',
        'EMAIL already exists',
      );
    }
    const role = await this.prismaApp.roles.findFirst({
      where: {
        id: roleId,
      },
    });
    if (!role) {
      throw new AppException(404, 'ROLE_NOT_FOUND', 'Role not found');
    }
    const generatedPassword = generatePassword();
    const hashedPassword = await hashPassword(generatedPassword);
    const newUser = await this.prismaApp.users.create({
      data: {
        id: uuidv7(),
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId,
        fullName: name,
        email,
        phoneNumber,
        posisi,
        password: hashedPassword,
      },
    });
    console.log(generatedPassword);
    return { ...newUser, password: generatedPassword };
  }
  async updateUser(id: string, dto: UpdateUserDto) {
    const { email, name, phoneNumber, posisi } = dto;
    const user = await this.prismaApp.users.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      throw new AppException(404, 'USER_NOT_FOUND', 'User not found');
    }

    return await this.prismaApp.users.update({
      where: {
        id,
      },
      data: {
        fullName: name,
        email,
        phoneNumber,
        posisi,
      },
    });
  }
  async getRoleList() {
    return await this.prismaApp.roles.findMany();
  }
  async deleteUser(id: string) {
    return await this.prismaApp.users.delete({
      where: {
        id,
      },
    });
  }
}
