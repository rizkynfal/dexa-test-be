import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { AppException } from './app-exception';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;

      console.error(exception);
    let error = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong.',
      details: null,
    };
    if (exception instanceof RpcException) {
      const rpcError = exception.getError() as any;

      status = rpcError.statusCode || 500;

      error = {
        code: rpcError.code,
        message: rpcError.message,
        details: rpcError.details ?? null,
      };
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse() as any;

      error = {
        code: res.code ?? 'HTTP_EXCEPTION',
        message: res.message,
        details: res.details ?? null,
      };
    }
    if ( exception instanceof AppException) {
      status = exception.statusCode ?? 500;
      error = {
        code: exception.code ?? 'INTERNAL_SERVER_ERROR',
        message: exception.message ?? 'Something went wrong.',
        details: exception.details ?? null,
      };
    }
    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: request.headers['x-request-id'],
      },
    });
  }
}
