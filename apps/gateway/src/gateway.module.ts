import { ConfigModule } from '@app/config';
import { EtcdModule } from '@app/etcd';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
    EtcdModule.forRoot({
      hosts: 'http://localhost:2379',
      auth: {
        username: 'root',
        password: '890224',
      },
    }),
  ],
  controllers: [UserController],
})
export class GatewayModule {}
