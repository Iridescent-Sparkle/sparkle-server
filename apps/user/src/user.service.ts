import { RedisService } from '@app/redis';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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

  async smsCode(phone: string) {
    const code = Math.random().toString().slice(2, 6);
    console.log(code);
    await this.redisService.set(`smsCode_${phone}`, code, 5 * 60);
    // await this.smsService.sendSms({
    //   phone,
    //   code,
    // });
    return {
      countDown: 60,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const captcha = await this.redisService.get(
      `smsCode_${registerUserDto.phone}`,
    );
    console.log(`smsCode_${registerUserDto.phone}`, captcha);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (registerUserDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: registerUserDto.username,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = registerUserDto.username;
    newUser.password = md5(registerUserDto.password);
    newUser.phone = registerUserDto.phone;
    newUser.nickName = '用户' + Math.random().toString().slice(2, 6);

    try {
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

  async initData() {
    const user1 = new User();
    user1.username = 'zhangsan';
    user1.password = md5('111111');
    user1.email = 'xxx@xx.com';
    user1.isAdmin = true;
    user1.nickName = '张三';
    user1.phone = '13233323333';

    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5('222222');
    user2.email = 'yy@yy.com';
    user2.nickName = '李四';

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
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
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (md5(loginUserDto.password) !== foundUser.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo({
      id: foundUser.id,
      username: foundUser.username,
      nickName: foundUser.nickName,
      email: foundUser.email,
      phone: foundUser.phone,
      headPic: foundUser.headPic,
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

  async validateSmsCode(phone: string, code: string) {
    const captcha = await this.redisService.get(`smsCode_${phone}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (code !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    return {};
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
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
