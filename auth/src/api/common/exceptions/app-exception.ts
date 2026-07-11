import { RpcException } from '@nestjs/microservices';

export class AppException extends RpcException {
  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: any,
  ) {
    super({
      statusCode,
      code,
      message,
      details,
    });
  }
} 