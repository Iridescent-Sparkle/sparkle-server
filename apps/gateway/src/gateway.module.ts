import { ConfigModule } from '@app/config';
import { EtcdModule } from '@app/etcd';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './controllers/user.controller';
import { ConfigService } from '@nestjs/config';

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
    EtcdModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          hosts: configService.get('etcd_hosts'),
          auth: {
            username: configService.get('etcd_username'),
            password: configService.get('etcd_password'),
          },
        };
      },
    }),
  ],
  controllers: [UserController],
})
export class GatewayModule {}
