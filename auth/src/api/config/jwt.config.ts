import { Configuration, Value } from '@itgorillaz/configify';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class JWTConfig {
  @Value('JWT_SECRET')
  @IsString()
  @IsNotEmpty()
  secret!: string;

  @Value('JWT_SECRET_REFRESH')
  @IsString()
  @IsNotEmpty()
  secretRefresh!: string;

  @Value('JWT_EXPIRE', {
    parse: (value: any) => parseInt(value),
  })
  @IsInt()
  expireIn!: number;

  @Value('JWT_REFRESH_EXPIRE', {
    parse: (value: any) => parseInt(value),
  })
  @IsInt()
  expireRefreshIn!: number;
}
