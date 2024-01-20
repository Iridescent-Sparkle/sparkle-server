import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@app/config';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'user',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:8888',
          package: 'user',
          protoPath: './proto/user.proto',
        },
      },
    ]),
  ],
  controllers: [UserController],
})
export class GatewayModule {}
