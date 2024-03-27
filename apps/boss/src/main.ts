import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BossModule } from './boss.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BossModule,
    {
      transport: Transport.GRPC,
      options: {
        url:
          process.env.NODE_ENV === 'production'
            ? '0.0.0.0:3002'
            : 'localhost:3002',
        package: 'boss',
        protoPath: [
          process.env.NODE_ENV === 'production'
            ? join(__dirname, './proto/category.proto')
            : './proto/category.proto',
          process.env.NODE_ENV === 'production'
            ? join(__dirname, './proto/job.proto')
            : './proto/job.proto',
        ],
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
