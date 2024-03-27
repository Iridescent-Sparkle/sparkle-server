import { ConfigModule } from '@app/config';
import { EtcdModule } from '@app/etcd';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DeliverController } from './controllers/deliver.controller';
import { JobController } from './controllers/job.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'user',
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          return {
            transport: Transport.GRPC,
            options: {
              url: configService.get('user_server_host'),
              package: 'user',
              protoPath:
                process.env.NODE_ENV === 'production'
                  ? join(__dirname, './proto/user.proto')
                  : './proto/user.proto',
              loader: {
                defaults: true,
                json: true,
                oneofs: true,
                objects: true,
                arrays: true,
                longs: String,
                enums: String,
              },
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
                  : './proto/category.proto',
                process.env.NODE_ENV === 'production'
                  ? join(__dirname, './proto/job.proto')
                  : './proto/job.proto',
              ],
              loader: {
                defaults: true,
                json: true,
                oneofs: true,
                objects: true,
                arrays: true,
                longs: String,
                enums: String,
              },
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
                  ? join(__dirname, './proto/deliver.proto')
                  : './proto/deliver.proto',
              loader: {
                defaults: true,
                json: true,
                oneofs: true,
                objects: true,
                arrays: true,
                longs: String,
                enums: String,
              },
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
  controllers: [
    UserController,
    // CategoryController,
    JobController,
    DeliverController,
  ],
})
export class GatewayModule {}
