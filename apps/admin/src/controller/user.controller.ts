import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AdminUser } from '../entities/user.entity';
import { AdminUserService } from '../service/user.service';

@Controller()
export class AdminUserController {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  constructor(private readonly adminService: AdminUserService) {}

  /** 获取邮箱验证码 */
  @MessagePattern('captcha')
  async captcha({ address }: { address: string }) {
    return await this.adminService.captcha(address);
  }

  /** 获取短信验证码 */
  @MessagePattern('smsCode')
  async smsCode({ phone }: { phone: string }) {
    console.log(phone);
    return await this.adminService.smsCode(phone);
  }

  /** 注册 */
  @MessagePattern('register')
  register(registerUser: RegisterUserDto) {
    return this.adminService.register(registerUser);
  }

  /** 验证短信验证码 */
  @MessagePattern('validateSmsCode')
  async validateSmsCode({ phone, code }: { phone: string; code: string }) {
    return await this.adminService.validateSmsCode(phone, code);
  }

  /** 重置密码 */
  @MessagePattern('resetPassword')
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return await this.adminService.resetPassword(resetPasswordDto);
  }

  /** 管理员登录 */
  @MessagePattern('adminLogin')
  async adminLogin(loginUserDto: LoginUserDto) {
    return await this.adminService.login(loginUserDto);
  }

  /** 刷新token */
  @MessagePattern('refresh')
  async refresh({ refreshToken }: { refreshToken: string }) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.adminService.findUserById(data.userId);
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
      throw new RpcException({
        message: 'token 已失效，请重新登录',
        code: HttpStatus.UNAUTHORIZED,
      });
    }
  }
  /** 获取OSS STS Token */
  @MessagePattern('getStsToken')
  async getStsToken({}: object) {
    return await this.adminService.getStsToken();
  }

  /** 获取用户信息 */
  @MessagePattern('info')
  async info({ userId }: { userId: number }) {
    return await this.adminService.findUserById(userId);
  }

  /** 更新用户信息 */
  @MessagePattern('update')
  async update(user: AdminUser) {
    return await this.adminService.update(user);
  }
}
