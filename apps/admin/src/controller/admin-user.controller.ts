import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AdminUser } from '../entities/user.entity';
import { AdminUserService } from '../service/admin-user.service';

@Controller()
export class AdminUserController {
  constructor(private readonly adminService: AdminUserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @MessagePattern('register')
  register(registerUser: RegisterUserDto) {
    return this.adminService.register(registerUser);
  }

  @MessagePattern('validateSmsCode')
  async validateSmsCode({ phone, code }: { phone: string; code: string }) {
    return await this.adminService.validateSmsCode(phone, code);
  }

  @MessagePattern('resetPassword')
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return await this.adminService.resetPassword(resetPasswordDto);
  }

  @MessagePattern('adminLogin')
  async adminLogin(loginUserDto: LoginUserDto) {
    return await this.adminService.login(loginUserDto);
  }

  @MessagePattern('refresh')
  async refresh(token: string) {
    try {
      const data = this.jwtService.verify(token);
      const user = await this.adminService.findUserById(data.userId);
      const accessToken = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn:
            this.configService.get('jwt_admin_access_token_expires_time') ||
            '30m',
        },
      );

      const refreshToken = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_admin_refresh_token_expres_time') ||
            '7d',
        },
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new RpcException({
        message: 'token 已失效，请重新登录',
        code: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  @MessagePattern('info')
  async info({ userId }: { userId: number }) {
    return await this.adminService.findUserById(userId);
  }

  @MessagePattern('findAllUser')
  async findAllUser(params: AdminUser & Pagination) {
    return await this.adminService.findAllUser(params);
  }

  @MessagePattern('updateAdminUser')
  async updateAdminUser(user: AdminUser) {
    return await this.adminService.updateAdminUser(user);
  }
}
