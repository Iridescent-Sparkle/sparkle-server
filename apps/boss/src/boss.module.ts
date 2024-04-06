import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { EmailModule } from '@app/email';
import { JwtModule } from '@app/jwt';
import { RedisModule } from '@app/redis';
import { SmsModule } from '@app/sms';
import { WinstonModule } from '@app/winston';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCollect } from 'apps/genius/src/entities/collect.entity';
import { JobDeliver } from 'apps/genius/src/entities/deliver.entity';
import { User } from 'apps/user/src/entities/user.entity';
import * as chalk from 'chalk';
import { format, transports } from 'winston';
import { BonusController } from './controller/bonus.controller';
import { CategoryController } from './controller/category.controller';
import { EducationController } from './controller/education.controller';
import { ExperienceController } from './controller/experience.controller';
import { JobController } from './controller/job.controller';
import { LevelController } from './controller/level.controller';
import { JobBonus } from './entities/bonus.entity';
import { JobCategory } from './entities/category.entity';
import { Company } from './entities/company.entity';
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
import { Profile } from 'apps/genius/src/entities/profile.entity';
import { CompanyController } from './controller/company.controller';
import { CompanyService } from './service/company.service';
import { IntegralMeal } from './entities/integral.entity';
import { IntegralService } from './service/integral.service';
import { IntegralController } from './controller/integral.controller';
import { AlipayModule } from '@app/alipay';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { OrderInfo } from './entities/order.entity';
import { Contact } from './entities/contact.entity';
import { Education } from 'apps/genius/src/entities/education.entity';
import { Experience } from 'apps/genius/src/entities/experience.entity';
import { Project } from 'apps/genius/src/entities/project.entity';
import { Volunteer } from 'apps/genius/src/entities/volunteer.entity';

@Module({
  imports: [
    AlipayModule,
    ConfigModule,
    DbModule,
    RedisModule,
    JwtModule,
    EmailModule,
    SmsModule,
    TypeOrmModule.forFeature([
      User,
      Company,
      Profile,
      JobDetail,
      JobCategory,
      JobBonus,
      JobEducation,
      JobLevel,
      JobExperience,
      JobCollect,
      JobDeliver,
      IntegralMeal,
      OrderInfo,
      Contact,
      Education,
      Experience,
      Project,
      Volunteer,
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
    JobController,
    CategoryController,
    BonusController,
    EducationController,
    ExperienceController,
    LevelController,
    CompanyController,
    IntegralController,
    OrderController,
  ],
  providers: [
    JobService,
    CategoryService,
    BonusService,
    EducationService,
    ExperienceService,
    LevelService,
    CompanyService,
    IntegralService,
    OrderService,
  ],
})
export class BossModule {}
