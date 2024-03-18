import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@app/redis';
import { JwtModule } from '@app/jwt';
import { WinstonModule } from '@app/winston';
import { format, transports } from 'winston';
import * as chalk from 'chalk';
import { EmailModule } from '@app/email';
import { SmsModule } from '@app/sms';
import { BossController } from './boss.controller';
import { BossService } from './boss.service';
import { JobDetail } from './entities/job.entity';

@Module({
  imports: [
    ConfigModule,
    DbModule,
    TypeOrmModule.forFeature([JobDetail]),
    RedisModule,
    JwtModule,
    EmailModule,
    SmsModule,
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
  controllers: [BossController],
  providers: [BossService],
})
export class BossModule {}
