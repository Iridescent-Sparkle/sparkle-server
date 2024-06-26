import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const httpResponse = host.switchToHttp().getResponse<Response>();

    httpResponse.statusCode = exception.getStatus();

    const exceptionResponse = exception.getResponse() as { message: string[] };

    httpResponse
      .json({
        code: exception.getStatus(),
        message: 'fail',
        data: exceptionResponse?.message?.join
          ? exceptionResponse?.message?.join(',')
          : exception.message,
      })
      .end();
  }
}
