import { RpcException } from "@nestjs/microservices";

export class AppException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: any,
  ) {
    super(message);
  }
}
