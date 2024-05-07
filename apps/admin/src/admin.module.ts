import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { EmailModule } from '@app/email';
import { ImModule } from '@app/im';
import { JwtModule } from '@app/jwt';
import { OssModule } from '@app/oss';
import { RedisModule } from '@app/redis';
import { SmsModule } from '@app/sms';
import { WinstonModule } from '@app/winston';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'apps/boss/src/entities/company.entity';
import { Contact } from 'apps/boss/src/entities/contact.entity';
import { Education } from 'apps/genius/src/entities/education.entity';
import { Experience } from 'apps/genius/src/entities/experience.entity';
import { Profile } from 'apps/genius/src/entities/profile.entity';
import { Project } from 'apps/genius/src/entities/project.entity';
import { Volunteer } from 'apps/genius/src/entities/volunteer.entity';
import { User } from 'apps/user/src/entities/user.entity';
import * as chalk from 'chalk';
import { format, transports } from 'winston';
import { AdminUserController } from './controller/admin-user.controller';
import { PermissionController } from './controller/permission.controller';
import { RoleController } from './controller/role.controller';
import { TradeControlController } from './controller/trade-control.controller';
import { CustomUserController } from './controller/user.controller';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { TradeControl } from './entities/trade.entity';
import { AdminUser } from './entities/user.entity';
import { AdminUserService } from './service/admin-user.service';
import { PermissionService } from './service/permission.service';
import { RoleService } from './service/role.service';
import { TradeControlService } from './service/trade-control.service';
import { CustomUserService } from './service/user.service';

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
      TradeControl,
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
    TradeControlController,
  ],
  providers: [
    AdminUserService,
    PermissionService,
    RoleService,
    CustomUserService,
    TradeControlService,
  ],
})
export class AdminModule {}
