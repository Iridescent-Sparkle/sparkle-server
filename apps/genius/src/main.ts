import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CustomExceptionFilter } from 'filters/custom-exception.filter';
import { FormatResponseInterceptor } from 'interceptors/format-response.interceptor';
import { InvokeRecordInterceptor } from 'interceptors/invoke-record.interceptor';
import { GeniusModule } from './genius.module';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   GeniusModule,
  //   {
  //     transport: Transport.GRPC,
  //     options: {
  //       url: 'localhost:8889',
  //       package: 'user',
  //       protoPath: './proto/user.proto',
  //     },
  //   },
  // );
  // app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  // app.listen();
  const app = await NestFactory.create<NestExpressApplication>(GeniusModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(3001);
}
bootstrap();
