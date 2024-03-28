import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { EmailModule } from '@app/email';
import { JwtModule } from '@app/jwt';
import { RedisModule } from '@app/redis';
import { SmsModule } from '@app/sms';
import { WinstonModule } from '@app/winston';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'apps/user/src/entities/permission.entity';
import { Role } from 'apps/user/src/entities/role.entity';
import { User } from 'apps/user/src/entities/user.entity';
import * as chalk from 'chalk';
import { format, transports } from 'winston';
import { BonusController } from './controller/bonus.controller';
import { CategoryController } from './controller/category.controller';
import { ExperienceController } from './controller/experience.controller';
import { JobController } from './controller/job.controller';
import { LevelController } from './controller/level.controller';
import { JobBonus } from './entities/bonus.entity';
import { JobCategory } from './entities/category.entity';
import { JobEducation } from './entities/education.entity';
import { JobExperience } from './entities/experience.entity';
import { JobDetail } from './entities/job.entity';
import { JobLevel } from './entities/level.entity';
import { BonusService } from './service/bonus.service';
import { CategoryService } from './service/category.service';
import { EducationService } from './service/education.service';
import { ExperienceService } from './service/experience.service';
import { JobService } from './service/job.service';
import { LevelService } from './service/level.service';
import { EducationController } from './controller/education.controller';

@Module({
  imports: [
    ConfigModule,
    DbModule,
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      JobDetail,
      JobCategory,
      JobBonus,
      JobEducation,
      JobLevel,
      JobExperience,
    ]),
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
  controllers: [
    JobController,
    CategoryController,
    BonusController,
    EducationController,
    ExperienceController,
    LevelController,
  ],
  providers: [
    JobService,
    CategoryService,
    BonusService,
    EducationService,
    ExperienceService,
    LevelService,
  ],
})
export class BossModule {}
