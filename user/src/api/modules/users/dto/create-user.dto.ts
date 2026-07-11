import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({
    type: String,
    required: false,
    description: 'email',
    format: 'email',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    description: 'name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    description: 'phone number',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    description: 'posisi',
  })
  @IsOptional()
  @IsString()
  posisi?: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'role id',
  })
  @IsNotEmpty()
  @IsString()
  roleId?: string;
}
