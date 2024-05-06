import { EmailService } from '@app/email';
import { ImService } from '@app/im';
import { OssService } from '@app/oss';
import { RedisService } from '@app/redis';
import { SmsService } from '@app/sms';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { Role } from '../entities/role.entity';
import { AdminUser } from '../entities/user.entity';
import { md5 } from '../utils';

@Injectable()
export class AdminUserService {
  private logger = new Logger();

  @InjectRepository(AdminUser)
  private adminUserRepository: Repository<AdminUser>;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(SmsService)
  private smsService: SmsService;

  @Inject(ImService)
  private imService: ImService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(OssService)
  private ossService: OssService;

  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;

  async captcha(address: string) {
    const code = Math.random().toString().slice(2, 6);
    await this.redisService.set(`captcha_admin_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是${code}</p>`,
    });
    return {
      countDown: 60,
    };
  }

  async smsCode(username: string) {
    const code = Math.random().toString().slice(2, 6);
    await this.redisService.set(`smsCode_admin_${username}`, '1234', 5 * 60);
    // await this.smsService.sendSms({
    //   username,
    //   code,
    // });
    return {
      countDown: 60,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    try {
      const captcha = await this.redisService.get(
        `smsCode_admin_${registerUserDto.username}`,
      );

      if (!captcha) {
        throw new RpcException('验证码已失效');
      }

      if (registerUserDto.captcha !== captcha) {
        throw new RpcException('验证码不正确');
      }

      const foundUser = await this.adminUserRepository.findOneBy({
        username: registerUserDto.username,
      });

      if (foundUser) {
        throw new RpcException('用户已存在');
      }

      const newUser = new AdminUser();
      newUser.username = registerUserDto.username;
      newUser.password = md5(registerUserDto.password);
      newUser.username = registerUserDto.username;
      newUser.nickname = '用户' + Math.random().toString().slice(2, 6);
      newUser.avatar =
        'https://sparkle-cdn.oss-cn-chengdu.aliyuncs.com/sparkle-mobile/stars.png';

      await this.adminUserRepository.save(newUser);

      return {
        message: '注册成功',
      };
    } catch (error) {
      this.logger.error(error, AdminUserService);
      return {
        message: '注册失败',
      };
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const foundUser = await this.adminUserRepository.findOne({
      where: {
        username: loginUserDto.username,
      },
    });

    if (!foundUser) {
      throw new RpcException('用户不存在');
    }

    if (md5(loginUserDto.password) !== foundUser.password) {
      throw new RpcException('密码错误');
    }

    const token = {
      accessToken: this.jwtService.sign(
        {
          userId: foundUser.id,
          username: foundUser.username,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      ),
      refreshToken: this.jwtService.sign(
        {
          userId: foundUser.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      ),
    };

    return token;
  }

  async validateSmsCode(username: string, code: string) {
    const foundUser = await this.adminUserRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!foundUser) {
      throw new RpcException('用户不存在');
    }

    const captcha = await this.redisService.get(`smsCode_admin_${username}`);

    if (!captcha) {
      throw new RpcException('验证码已失效');
    }
    console.log(captcha, code, username);
    if (code !== captcha) {
      throw new RpcException('验证码不正确');
    }

    return {};
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const foundUser = await this.adminUserRepository.findOne({
      where: {
        username: resetPasswordDto.username,
      },
    });

    if (!foundUser) {
      throw new RpcException('用户不存在');
    }

    return await this.adminUserRepository.update(resetPasswordDto.username, {
      password: md5(resetPasswordDto.password),
    });
  }

  async findUserById(userId: number) {
    const foundUser = await this.adminUserRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles', 'roles.permissions'],
    });

    const permissionMap = new Map();

    const permissions = foundUser.roles.reduce((arr, item) => {
      item.permissions.forEach((permission) => {
        if (arr.indexOf(permission) === -1) {
          arr.push(permission);
        }
      });
      return arr;
    }, []);

    permissions.forEach((permission) => {
      permissionMap.set(permission.id, permission);
    });

    return {
      id: foundUser.id,
      username: foundUser.username,
      roles: foundUser.roles.map((item) => item.name),
      permissions: Array.from(permissionMap.values()),
    };
  }

  async updateAdminUser(user: AdminUser) {
    const foundUser = await this.adminUserRepository.findOneBy({
      id: user.id,
    });

    if (user.username) {
      foundUser.username = user.username;
    }

    if (user.roles) {
      foundUser.roles = [];

      for (const roleId of user.roles) {
        const role = await this.roleRepository.findOne({
          where: {
            id: roleId as unknown as number,
          },
        });

        if (role) {
          foundUser.roles.push(role);
        }
      }
    }

    if (user.isFrozen !== undefined) {
      foundUser.isFrozen = user.isFrozen;
    }

    return await this.adminUserRepository.save(foundUser);
  }

  async getStsToken() {
    return await this.ossService.getSTSToken();
  }

  async findAllUser(params: AdminUser & Pagination) {
    const { page = 1, pageSize = 10, ...rest } = params;

    const condition: Record<string, any> = {
      id: rest.id,
    };

    if (rest.username) {
      condition.username = Like(`%${rest.username}%`);
    }

    if (rest.nickname) {
      condition.nickname = Like(`%${rest.nickname}%`);
    }

    if (rest.createTime) {
      condition.createTime = Between(
        new Date(rest.createTime[0]),
        new Date(rest.createTime[1]),
      );
    }

    if (rest.updateTime) {
      condition.updateTime = Between(
        new Date(rest.updateTime[0]),
        new Date(rest.updateTime[1]),
      );
    }

    if (rest.isFrozen !== undefined) {
      condition.isFrozen = rest.isFrozen;
    }

    if (rest.roles) {
      condition.roles = {
        id: In(rest.roles),
      };
    }

    const [data, total] = await this.adminUserRepository.findAndCount({
      where: condition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['roles'],
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }
}
