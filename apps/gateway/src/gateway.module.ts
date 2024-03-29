import { ConfigModule } from '@app/config';
import { EtcdModule } from '@app/etcd';
import { JwtModule } from '@app/jwt';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoginGuard } from 'guards/login.guard';
import { PermissionGuard } from 'guards/permission.guard';
import { join } from 'path';
import { CategoryController } from './controllers/boss/category.controller';
import { JobController } from './controllers/boss/job.controller';
import { UserController } from './controllers/user/user.controller';
import { BonusController } from './controllers/boss/bonus.controller';
import { ExperienceController } from './controllers/boss/experience.controller';
import { LevelController } from './controllers/boss/level.controller';
import { EducationController } from './controllers/boss/education.controller';
import { DeliverController } from './controllers/genius/deliver.controller';
import { FavoriteController } from './controllers/genius/favorite.controller';
import { ProfileController } from './controllers/genius/profile.controller';
import { ProjectController } from './controllers/genius/project.controller';
import { VolunteerController } from './controllers/genius/volunteer.controller';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    ClientsModule.register([
      {
        name: 'BOSS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
          port: 3002,
        },
      },
      {
        name: 'GENIUS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
          port: 3003,
        },
      },
    ]),
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
    JobController,
    BonusController,
    CategoryController,
    ExperienceController,
    LevelController,
    EducationController,
    DeliverController,
    ExperienceController,
    FavoriteController,
    ProfileController,
    ProjectController,
    VolunteerController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class GatewayModule {}
