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
import { ConfigService } from '@nestjs/config';
import { Contact } from 'apps/boss/src/entities/contact.entity';
import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { JobBonus } from 'apps/boss/src/entities/bonus.entity';
import { JobExperience } from 'apps/boss/src/entities/experience.entity';
import { JobEducation } from 'apps/boss/src/entities/education.entity';
import { JobLevel } from 'apps/boss/src/entities/level.entity';
import { JobCategory } from 'apps/boss/src/entities/category.entity';
import { JobCollect } from 'apps/genius/src/entities/collect.entity';
import { JobDeliver } from 'apps/genius/src/entities/deliver.entity';
import { Education } from 'apps/genius/src/entities/education.entity';
import { Volunteer } from 'apps/genius/src/entities/volunteer.entity';
import { Project } from 'apps/genius/src/entities/project.entity';
import { Experience } from 'apps/genius/src/entities/experience.entity';

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
      User,
      Company,
      Profile,
      Contact,
      JobDetail,
      JobBonus,
      JobExperience,
      JobLevel,
      JobEducation,
      JobCategory,
      JobCollect,
      JobDeliver,
      Education,
      Volunteer,
      Project,
      Experience,
    ]),
    ClientsModule.registerAsync([
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
