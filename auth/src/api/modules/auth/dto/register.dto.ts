import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'email',
    format: 'email',
  })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'employee full name',
  })
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'role',
  })
  @IsNotEmpty()
  @IsString()
  roleId!: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'password',
    format: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
