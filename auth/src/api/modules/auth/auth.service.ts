import { comparePassword, PrismaService } from '@auth/lib';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AppException, STATUS_CODE_SERVICE } from 'src/api/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './interface/login.interface';
import { JWTConfig } from '@auth/config';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JWTConfig,
  ) {}
  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.prismaService.users.findFirst({
      where: {
        email: { equals: email },
      },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'USER_NOT_FOUND',
        'username or password is incorrect',
        null,
      );
    }
    const isPasswordValid =
      user.password && (await comparePassword(password, user.password));
    if (!isPasswordValid) {
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'USER_NOT_FOUND',
        'username or password is incorrect',
        null,
      );
    }
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.roles?.code,
      name: user.fullName,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: this.jwtConfig.expireIn,
      secret: this.jwtConfig.secret,
    });
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: this.jwtConfig.expireRefreshIn,
      secret: this.jwtConfig.secretRefresh,
    });
    const expiresDate = new Date();
    expiresDate.setHours(expiresDate.getHours() + this.jwtConfig.expireIn);
    const refreshExpiresDate = new Date();
    refreshExpiresDate.setHours(
      refreshExpiresDate.getHours() + this.jwtConfig.expireRefreshIn,
    );
    const response: LoginResponse = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires: expiresDate,
      expires_at: Math.floor(expiresDate.getTime() / 1000),
      refresh_token_expires: refreshExpiresDate,
      user: user,
    };
    return response;
  }
  async register(dto: RegisterDto) {
    const { email, fullName, password, roleId } = dto;
    const user = await this.prismaService.users.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'USER_ALREADY_EXISTS',
        'User Email already exists',
        null,
      );
    }
    const role = await this.prismaService.roles.findUnique({
      where: {
        id: roleId,
      },
    });
    if (!role) {
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'ROLE_NOT_FOUND',
        'Role not found',
        null,
      );
    }
    const newUser = await this.prismaService.users.create({
      data: {
        email,
        fullName,
        password,
        roleId,
      },
    });
    return newUser;
  }
  async refreshToken(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.prismaService.users.findFirst({
      where: {
        id: payload.sub,
      },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new AppException(
        STATUS_CODE_SERVICE.BAD_REQUEST,
        'USER_NOT_FOUND',
        'User not found',
        null,
      );
    }
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.roles?.code,
      name: user.fullName,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: this.jwtConfig.secret,
      expiresIn: this.jwtConfig.expireIn,
    });

    return {
      accessToken,
    };
  }
}
