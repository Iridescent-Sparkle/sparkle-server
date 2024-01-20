import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';

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

  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));

  app.listen();
}
bootstrap();
