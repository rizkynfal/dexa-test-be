import { Configuration, Value } from '@itgorillaz/configify';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Configuration()
export class DatabaseConfig {
  @Value('DATABASE_URL')
  @IsString()
  @IsNotEmpty()
  url!: string;

  @Value('DATABASE_SCHEMA')
  @IsString()
  @IsNotEmpty()
  schema: string = 'defaultdb';

  @Value('DATABASE_NAME')
  @IsString()
  @IsNotEmpty()
  name: string = 'false';

  @Value('DATABASE_USERNAME')
  @IsString()
  @IsNotEmpty()
  username!: string;

  @Value('DATABASE_PASSWORD')
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Value('DATABASE_HOST')
  @IsString()
  @IsNotEmpty()
  host!: string;

  @Value('DATABASE_PORT', { parse: (value: any) => parseInt(value) })
  @IsInt()
  @IsNotEmpty()
  port!: number;
}
