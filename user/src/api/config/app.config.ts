import { Configuration, Value } from '@itgorillaz/configify';
import { IsIn, IsInt, IsIP, IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class AppConfig {
  @Value('NODE_ENV')
  @IsString()
  @IsNotEmpty()
  @IsIn(['development', 'production', 'test', 'staging', 'local'])
  env!: string;
  
  @Value('APP_PORT', {
    parse: (value: any) => parseInt(value),
  })
  @IsInt()
  port!: number;

  @Value('SERVICE_PORT', {
    parse: (value: any) => parseInt(value),
  })
  @IsInt()
  servicePort!: number;

  @Value('APP_NAME')
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Value('APP_URL')
  @IsString()
  @IsNotEmpty()
  appUrl!: string;

  @Value('SECRET_KEY_INTERNAL')
  @IsString()
  @IsNotEmpty()
  internalSecret!: string;
}
