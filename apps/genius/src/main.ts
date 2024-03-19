import { NestFactory } from '@nestjs/core';
import { GeniusModule } from './genius.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_LOGGER_TOKEN } from '@app/winston';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   GeniusModule,
  //   {
  //     transport: Transport.GRPC,
  //     options: {
  //       url: 'localhost:8889',
  //       package: 'user',
  //       protoPath: './proto/user.proto',
  //     },
  //   },
  // );
  // app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  // app.listen();
  const app = await NestFactory.create<NestExpressApplication>(GeniusModule);
  await app.listen(3001);
}
bootstrap();
