import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';

async function bootstrap() {
  console.log(1);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:8888',
        package: 'user',
        protoPath: './proto/user.proto',
      },
    },
  );
  console.error(1);
  app.listen();
}
bootstrap();
