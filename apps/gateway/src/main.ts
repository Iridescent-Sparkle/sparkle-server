import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   UserModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       port: 8888,
  //     },
  //   },
  // );
  // app.listen();
}
bootstrap();
