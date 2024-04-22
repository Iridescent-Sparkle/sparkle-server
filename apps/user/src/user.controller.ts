import { Controller, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Company } from 'apps/boss/src/entities/company.entity';

@Controller()
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  constructor(private readonly userService: UserService) {}

  /** 获取邮箱验证码 */
  @GrpcMethod('UserService', 'EmailCode')
  async emailCode({ email }: { email: string }) {
    return await this.userService.emailCode(email);
  }

  /** 获取短信验证码 */
  @GrpcMethod('UserService', 'smsCode')
  async smsCode({ phone }: { phone: string }) {
    return await this.userService.smsCode(phone);
  }

  /** 注册 */
  @GrpcMethod('UserService', 'Register')
  register(registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  /** 登录 */
  @GrpcMethod('UserService', 'Login')
  async login(loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  /** 验证短信验证码 */
  @GrpcMethod('UserService', 'ValidateSmsCode')
  async validateSmsCode({ phone, code }: { phone: string; code: string }) {
    return await this.userService.validateSmsCode(phone, code);
  }

  /** 验证邮箱验证码 */
  @GrpcMethod('UserService', 'ValidateEmailCode')
  async validateEmailCode({ email, code }: { email: string; code: string }) {
    return await this.userService.validateEmailCode(email, code);
  }

  /** 重置密码 */
  @GrpcMethod('UserService', 'ResetPassword')
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  /** 管理员登录 */
  @GrpcMethod('UserService', 'AdminLogin')
  async adminLogin(loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  /** 刷新token */
  @GrpcMethod('UserService', 'Refresh')
  async refresh({ refreshToken }: { refreshToken: string }) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId);
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  /** 获取用户信息 */
  @GrpcMethod('UserService', 'Info')
  async info({ userId }: { userId: number }) {
    return await this.userService.findUserById(userId);
  }

  /** 更新用户信息 */
  @GrpcMethod('UserService', 'Update')
  async update(user: User) {
    return await this.userService.update(user);
  }

  /** 绑定邮箱 */
  @GrpcMethod('UserService', 'BindEmail')
  async bindEmail(params: { userId: number; email: string; code: string }) {
    return await this.userService.bindEmail(params);
  }

  /** 获取OSS STS Token */
  @GrpcMethod('UserService', 'GetStsToken')
  async getStsToken({}: object) {
    return await this.userService.getStsToken();
  }

  /** 创建公司信息 */
  @GrpcMethod('UserService', 'CreateCompanyInfo')
  async createCompanyInfo(params: { userId: number; company: Company }) {
    return await this.userService.createCompanyInfo(params);
  }

  @GrpcMethod('UserService', 'FindImUsers')
  async findImUsers(params: { userIds: string[] }) {
    const { userIds } = params;

    return await this.userService.findImUsers({
      userIds,
    });
  }
}
