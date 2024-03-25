import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GeniusModule } from './genius.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GeniusModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:3003',
        package: 'genius',
        protoPath: [
          process.env.NODE_ENV === 'production'
            ? join(__dirname, './proto/deliver.proto')
            : '/proto/deliver.proto',
          process.env.NODE_ENV === 'production'
            ? join(__dirname, './proto/genius.proto')
            : '/proto/genius.proto',
        ],
      },
    },
  );
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  app.listen();
}
bootstrap();
