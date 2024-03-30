import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AdminModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
        port: 3004,
      },
    },
  );

  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  app.listen();
}
bootstrap();
