import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(
    exception: { message: string; code: number; getStatus: () => number },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response
      .json({
        code: exception.code || HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'fail',
        data: exception.message,
      })
      .end();
  }
}
