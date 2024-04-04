import { EmailService } from '@app/email';
import { ImService } from '@app/im';
import { RedisService } from '@app/redis';
import { SmsService } from '@app/sms';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from './entities/user.entity';
import { md5 } from './utils/index';
import { Profile } from 'apps/genius/src/entities/profile.entity';
import { firstValueFrom } from 'rxjs';
import { OssService } from '@app/oss';
import { Logger } from 'winston';
import { Company } from 'apps/boss/src/entities/company.entity';

@Injectable()
export class UserService {
  private logger = new Logger();

  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @InjectRepository(User)
  private userRepository: Repository<User>;

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

  async captcha(address: string) {
    const code = Math.random().toString().slice(2, 6);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
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

    await this.redisService.set(`smsCode_${username}`, '1234', 5 * 60);
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
        `smsCode_${registerUserDto.username}`,
      );

      if (!captcha) {
        throw new RpcException('验证码已失效');
      }

      if (registerUserDto.captcha !== captcha) {
        throw new RpcException('验证码不正确');
      }

      const foundUser = await this.userRepository.findOneBy({
        username: registerUserDto.username,
      });

      if (foundUser) {
        throw new RpcException('用户已存在');
      }

      await this.imService.register({
        username: registerUserDto.username,
        roleType: 'C',
      });

      const profile = await firstValueFrom(
        this.GeniusClient.send('createProfile', new Profile()),
      );

      const newUser = new User();
      newUser.username = registerUserDto.username;
      newUser.password = md5(registerUserDto.password);
      newUser.username = registerUserDto.username;
      newUser.nickname = '用户' + Math.random().toString().slice(2, 6);
      newUser.contactPassword = registerUserDto.username + '_password';
      newUser.contactIdToB = registerUserDto.username + '_sparkle' + `_C`;
      newUser.profileId = profile.id;
      newUser.avatar =
        'https://sparkle-cdn.oss-cn-chengdu.aliyuncs.com/sparkle-mobile/stars.png';

      await this.userRepository.save(newUser);

      return {
        message: '注册成功',
      };
    } catch (error) {
      this.logger.error(error, UserService);
      return {
        message: '注册失败',
      };
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const foundUser = await this.userRepository.findOne({
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
    const foundUser = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!foundUser) {
      throw new RpcException('用户不存在');
    }

    const captcha = await this.redisService.get(`smsCode_${username}`);

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
    const foundUser = await this.userRepository.findOne({
      where: {
        username: resetPasswordDto.username,
      },
    });

    if (!foundUser) {
      throw new RpcException('用户不存在');
    }

    return await this.userRepository.update(resetPasswordDto.username, {
      password: md5(resetPasswordDto.password),
    });
  }

  async findUserById(userId: number) {
    console.log(
      await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: {
          company: true,
        },
      }),
    );
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        company: true,
      },
    });
  }

  async update(user: User) {
    console.log(user);
    return await this.userRepository.update(user.id, user);
  }

  async getStsToken() {
    return await this.ossService.getSTSToken();
  }

  async createCompanyInfo(params: { userId: number; company: Company }) {
    const { company, userId } = params;

    const companyInfo = await firstValueFrom(
      this.BossClient.send('createCompanyInfo', company),
    );

    return await this.userRepository.update(userId, {
      companyId: companyInfo.id,
    });
  }
}
