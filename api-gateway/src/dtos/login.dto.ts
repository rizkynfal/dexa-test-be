import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: String, required: false, description: 'email' , format: 'email'})
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'password',
    format: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
