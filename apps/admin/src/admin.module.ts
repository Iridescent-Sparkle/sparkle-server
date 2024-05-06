import { Module } from '@nestjs/common';
import { AdminUserController } from './controller/admin-user.controller';
import { AdminUserService } from './service/admin-user.service';
import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { AdminUser } from './entities/user.entity';
import { RedisModule } from '@app/redis';
import { JwtModule } from '@app/jwt';
import { WinstonModule } from '@app/winston';
import { format, transports } from 'winston';
import * as chalk from 'chalk';
import { EmailModule } from '@app/email';
import { SmsModule } from '@app/sms';
import { HttpModule } from '@nestjs/axios';
import { ImModule } from '@app/im';
import { OssModule } from '@app/oss';
import { PermissionController } from './controller/permission.controller';
import { PermissionService } from './service/permission.service';
import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';
import { User } from 'apps/user/src/entities/user.entity';
import { CustomUserController } from './controller/user.controller';
import { CustomUserService } from './service/user.service';
import { Company } from 'apps/boss/src/entities/company.entity';
import { Profile } from 'apps/genius/src/entities/profile.entity';
import { Education } from 'apps/genius/src/entities/education.entity';
import { Project } from 'apps/genius/src/entities/project.entity';
import { Volunteer } from 'apps/genius/src/entities/volunteer.entity';
import { Experience } from 'apps/genius/src/entities/experience.entity';
import { Contact } from 'apps/boss/src/entities/contact.entity';

@Module({
  imports: [
    OssModule,
    HttpModule,
    ConfigModule,
    ImModule,
    DbModule,
    RedisModule,
    JwtModule,
    EmailModule,
    SmsModule,
    TypeOrmModule.forFeature([
      AdminUser,
      Role,
      Permission,
      User,
      Company,
      Profile,
      Education,
      Project,
      Volunteer,
      Experience,
      Contact,
    ]),
    WinstonModule.forRoot({
      level: 'debug',
      format: format.combine(format.colorize(), format.simple()),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green(`[NEST]`);
              const contextStr = chalk.yellow(`[${context}]`);
              return `${appStr} ${time} ${level} ${contextStr} ${message}`;
            }),
          ),
        }),
        new transports.File({
          format: format.combine(format.timestamp(), format.json()),
          filename: 'user.log',
          dirname: 'log',
        }),
      ],
    }),
  ],
  controllers: [
    AdminUserController,
    PermissionController,
    RoleController,
    CustomUserController,
  ],
  providers: [
    AdminUserService,
    PermissionService,
    RoleService,
    CustomUserService,
  ],
})
export class AdminModule {}
