import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: {
        url:
          process.env.NODE_ENV === 'production'
            ? '0.0.0.0:3001'
            : 'localhost:3001',
        package: 'user',
        protoPath:
          process.env.NODE_ENV === 'production'
            ? join(__dirname, './proto/user.proto')
            : './proto/user.proto',
        loader: {
          defaults: true,
          json: true,
          oneofs: true,
          objects: true,
          arrays: true,
          longs: String,
          enums: String,
        },
      },
    },
  );
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  app.listen();
}
bootstrap();
