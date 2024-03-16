import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception);
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
