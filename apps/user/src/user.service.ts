import { RedisService } from '@app/redis';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { md5 } from './utils/index';
import { LoginUserVo } from './vo/login-user.vo';
import { EmailService } from '@app/email';
import { SmsService } from '@app/sms';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FitRpcException } from 'filters/rpc-exception.filter';
import { HttpService } from '@nestjs/axios';
import { ImService } from '@app/im';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(SmsService)
  private smsService: SmsService;

  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(ImService)
  private imService: ImService;

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
    // const code = Math.random().toString().slice(2, 6);

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
        throw new FitRpcException('验证码已失效', HttpStatus.BAD_REQUEST);
      }

      if (registerUserDto.captcha !== captcha) {
        throw new FitRpcException('验证码不正确', HttpStatus.BAD_REQUEST);
      }

      const foundUser = await this.userRepository.findOneBy({
        username: registerUserDto.username,
      });

      if (foundUser) {
        throw new FitRpcException('用户已存在', HttpStatus.BAD_REQUEST);
      }

      await this.imService.register({
        username: registerUserDto.username,
        roleType: 'C',
      });

      const newUser = new User();
      newUser.username = registerUserDto.username;
      newUser.password = md5(registerUserDto.password);
      newUser.username = registerUserDto.username;
      newUser.nickName = '用户' + Math.random().toString().slice(2, 6);

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

  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    const foundUser = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!foundUser) {
      throw new FitRpcException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (md5(loginUserDto.password) !== foundUser.password) {
      throw new FitRpcException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo({
      id: foundUser.id,
      username: foundUser.username,
      nickName: foundUser.nickName,
      email: foundUser.email,
      createTime: foundUser.createTime.getTime(),
      isFrozen: foundUser.isFrozen,
      isAdmin: foundUser.isAdmin,
      roles: foundUser.roles.map((item) => item.name),
      permissions: foundUser.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    });

    return vo;
  }

  async validateSmsCode(username: string, code: string) {
    const foundUser = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!foundUser) {
      throw new FitRpcException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const captcha = await this.redisService.get(`smsCode_${username}`);

    if (!captcha) {
      throw new FitRpcException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    console.log(captcha, code, username);
    if (code !== captcha) {
      throw new FitRpcException('验证码不正确', HttpStatus.BAD_REQUEST);
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
      throw new FitRpcException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.update(resetPasswordDto.username, {
      password: md5(resetPasswordDto.password),
    });
  }

  async findUserById(userId: number, isAdmin: boolean) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return {
      id: foundUser.id,
      username: foundUser.username,
      isAdmin: foundUser.isAdmin,
      roles: foundUser.roles.map((item) => item.name),
      permissions: foundUser.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  async findUserDetailById(userId: number) {
    return await this.userRepository.findOneBy({
      id: userId,
    });
  }
}
