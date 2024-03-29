import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GeniusModule } from './genius.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GeniusModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
        port: 3003,
      },
    },
  );

  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  app.listen();
}
bootstrap();
