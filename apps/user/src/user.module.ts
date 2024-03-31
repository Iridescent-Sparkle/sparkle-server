import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { EmailModule } from '@app/email';
import { ImModule } from '@app/im';
import { JwtModule } from '@app/jwt';
import { RedisModule } from '@app/redis';
import { SmsModule } from '@app/sms';
import { WinstonModule } from '@app/winston';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as chalk from 'chalk';
import { format, transports } from 'winston';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Company } from 'apps/boss/src/entities/company.entity';
import { Profile } from 'apps/genius/src/entities/profile.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
    TypeOrmModule.forFeature([User, Company, Profile]),
    ClientsModule.register([
      {
        name: 'GENIUS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
          port: 3003,
        },
      },
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
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
