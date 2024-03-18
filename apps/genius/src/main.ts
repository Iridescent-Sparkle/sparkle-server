import { NestFactory } from '@nestjs/core';
import { GeniusModule } from './genius.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_LOGGER_TOKEN } from '@app/winston';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GeniusModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:8889',
        package: 'user',
        protoPath: './proto/user.proto',
      },
    },
  );
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  app.listen();
}
bootstrap();
