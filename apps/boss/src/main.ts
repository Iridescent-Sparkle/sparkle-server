import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BossModule } from './boss.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BossModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
        port: 3002,
      },
    },
  );
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  app.listen();
}
bootstrap();
