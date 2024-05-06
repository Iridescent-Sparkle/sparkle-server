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
import { UserController as AdminUserController } from './controllers/admin/user.controller';
import { BonusController } from './controllers/boss/bonus.controller';
import { ExperienceController as BossExperienceController } from './controllers/boss/experience.controller';
import { LevelController } from './controllers/boss/level.controller';
import { EducationController as BossEducationController } from './controllers/boss/education.controller';
import { EducationController as GeniusEducationController } from './controllers/genius/education.controller';
import { DeliverController } from './controllers/genius/deliver.controller';
import { FavoriteController } from './controllers/genius/favorite.controller';
import { ProfileController } from './controllers/genius/profile.controller';
import { ProjectController } from './controllers/genius/project.controller';
import { VolunteerController } from './controllers/genius/volunteer.controller';
import { ExperienceController as GeniusExperienceController } from './controllers/genius/experience.controller';
import { IntegralController } from './controllers/boss/integral.controller';
import { OrderController } from './controllers/boss/order.controller';
import { ContactController } from './controllers/boss/contact.controller';
import { ConsumeController } from './controllers/boss/consume.controller';
import { PermissionController } from './controllers/admin/permission.controller';
import { RoleController } from './controllers/admin/role.controller';
import { CompanyController } from './controllers/boss/company.controller';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
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
        name: 'BOSS_SERVICE',
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get('boss_server_host'),
              port: 3002,
            },
          };
        },
      },
      {
        name: 'GENIUS_SERVICE',
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get('genius_server_host'),
              port: 3003,
            },
          };
        },
      },
      {
        name: 'ADMIN_SERVICE',
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get('admin_server_host'),
              port: 3004,
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
    BossExperienceController,
    GeniusExperienceController,
    LevelController,
    BossEducationController,
    GeniusEducationController,
    DeliverController,
    FavoriteController,
    ProfileController,
    ProjectController,
    VolunteerController,
    AdminUserController,
    IntegralController,
    OrderController,
    ContactController,
    ConsumeController,
    PermissionController,
    RoleController,
    CompanyController,
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
