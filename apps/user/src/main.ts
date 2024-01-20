import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from 'inteceptors/format-response.interceptor';
import { InvokeRecordInterceptor } from 'inteceptors/invoke-record.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:8888',
        package: 'user',
        protoPath: './proto/user.proto',
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));

  app.listen();
}
bootstrap();
