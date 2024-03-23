import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:3001',
        package: 'user',
        protoPath:
          process.env.NODE_ENV === 'production'
            ? join(__dirname, './proto/user.proto')
            : './proto/user.proto',
      },
    },
  );
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  app.listen();
}
bootstrap();
