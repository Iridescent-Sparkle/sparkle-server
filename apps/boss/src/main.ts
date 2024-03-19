import { NestFactory } from '@nestjs/core';
import { BossModule } from './boss.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BossService } from './boss.service';
import { FormatResponseInterceptor } from 'interceptors/format-response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { InvokeRecordInterceptor } from 'interceptors/invoke-record.interceptor';
import { CustomExceptionFilter } from 'filters/custom-exception.filter';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   BossModule,
  //   {
  //     transport: Transport.GRPC,
  //     options: {
  //       url: 'localhost:8890',
  //       package: 'user',
  //       protoPath: './proto/user.proto',
  //     },
  //   },
  // );
  // app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  // app.listen();
  const app = await NestFactory.create<NestExpressApplication>(BossModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  // const jobDetailService = app.get(BossService);
  // await jobDetailService.initializeJobDetails();
  await app.listen(3002);
}
bootstrap();
