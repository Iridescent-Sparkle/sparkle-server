import { Module } from '@nestjs/common';
import { AdminUserController } from './controller/user.controller';
import { AdminUserService } from './service/user.service';
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
    TypeOrmModule.forFeature([AdminUser, Role, Permission]),
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
  controllers: [AdminUserController],
  providers: [AdminUserService],
})
export class AdminModule {}
