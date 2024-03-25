import { ConfigModule } from '@app/config';
import { EtcdModule } from '@app/etcd';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './controllers/user.controller';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'user',
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          console.log(
            configService.get('user_server_host'),
            join(__dirname, './proto/user.proto'),
          );
          return {
            transport: Transport.GRPC,
            options: {
              url: configService.get('user_server_host'),
              package: 'user',
              protoPath:
                process.env.NODE_ENV === 'production'
                  ? join(__dirname, './proto/user.proto')
                  : '/proto/user.proto',
            },
          };
        },
      },
      {
        name: 'boss',
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          return {
            transport: Transport.GRPC,
            options: {
              url: configService.get('boss_server_host'),
              package: 'boss',
              protoPath: [
                process.env.NODE_ENV === 'production'
                  ? join(__dirname, './proto/category.proto')
                  : '/proto/category.proto',
                process.env.NODE_ENV === 'production'
                  ? join(__dirname, './proto/job.proto')
                  : '/proto/job.proto',
              ],
            },
          };
        },
      },
      {
        name: 'genius',
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          return {
            transport: Transport.GRPC,
            options: {
              url: configService.get('genius_server_host'),
              package: 'genius',
              protoPath:
                process.env.NODE_ENV === 'production'
                  ? join(__dirname, './proto/genius.proto')
                  : '/proto/genius.proto',
            },
          };
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
