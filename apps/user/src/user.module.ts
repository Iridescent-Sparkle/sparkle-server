import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisModule } from '@app/redis';
import { JwtModule } from '@app/jwt';

@Module({
  imports: [
    ConfigModule,
    DbModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
    RedisModule,
    JwtModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
