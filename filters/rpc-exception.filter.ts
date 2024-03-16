import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';

export interface IRpcException {
  details: string;
  message: string;
  status: number;
}

export class FitRpcException extends RpcException implements IRpcException {
  public status: number;
  public details: string;

  constructor(message: string, statusCode: HttpStatus) {
    super({ message: message + ' ' + statusCode });
    this.initStatusCode(statusCode);
  }

  private initStatusCode(statusCode) {
    this.status = statusCode;
  }
}

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: IRpcException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus = exception.details
      ? Number(exception.details.split(' ')[1])
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      code: httpStatus,
      data: exception.details,
      message: 'fail',
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
