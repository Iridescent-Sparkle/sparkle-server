import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { EmailModule } from '@app/email';
import { JwtModule } from '@app/jwt';
import { RedisModule } from '@app/redis';
import { SmsModule } from '@app/sms';
import { WinstonModule } from '@app/winston';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategory } from 'apps/boss/src/entities/category.entity';
import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { Permission } from 'apps/user/src/entities/permission.entity';
import { Role } from 'apps/user/src/entities/role.entity';
import { User } from 'apps/user/src/entities/user.entity';
import * as chalk from 'chalk';
import { format, transports } from 'winston';
import { DeliverController } from './controller/deliver.controller';
import { JobCollect } from './entities/collect.entity';
import { JobDeliver } from './entities/deliver.entity';
import { FavoriteController } from './controller/favorite.controller';
import { DeliverService } from './service/deliver.service';
import { FavoriteService } from './service/favorite.service';
import { Education } from './entities/education.entity';
import { Experience } from './entities/experience.entity';
import { Profile } from './entities/profile.entity';
import { Project } from './entities/project.entity';
import { Volunteer } from './entities/volunteer.entity';

import { ExperienceController } from './controller/experience.controller';
import { ProfileController } from './controller/profile.controller';
import { ProjectController } from './controller/project.controller';
import { VolunteerController } from './controller/volunteer.controller';
import { EducationService } from './service/education.service';
import { ExperienceService } from './service/experience.service';
import { ProfileService } from './service/profile.service';
import { ProjectService } from './service/project.service';
import { VolunteerService } from './service/volunteer.service';
import { JobBonus } from 'apps/boss/src/entities/bonus.entity';
import { JobExperience } from 'apps/boss/src/entities/experience.entity';
import { JobLevel } from 'apps/boss/src/entities/level.entity';
import { JobEducation } from 'apps/boss/src/entities/education.entity';
import { EducationController } from './controller/education.controller';

@Module({
  imports: [
    ConfigModule,
    DbModule,
    RedisModule,
    JwtModule,
    EmailModule,
    SmsModule,
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      JobCollect,
      JobDeliver,
      JobDetail,
      JobCategory,
      Education,
      Experience,
      Profile,
      Project,
      Volunteer,
      JobBonus,
      JobExperience,
      JobLevel,
      JobEducation,
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
    DeliverController,
    FavoriteController,
    EducationController,
    ExperienceController,
    ProfileController,
    ProjectController,
    VolunteerController,
  ],
  providers: [
    DeliverService,
    FavoriteService,
    EducationService,
    ExperienceService,
    ProfileService,
    ProjectService,
    VolunteerService,
  ],
})
export class GeniusModule {}
