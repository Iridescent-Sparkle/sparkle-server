import { Controller, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GrpcMethod } from '@nestjs/microservices';
import { RequireLogin } from 'decorators/custom.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'Captcha')
  async captcha({ address }: { address: string }) {
    return await this.userService.captcha(address);
  }

  @GrpcMethod('UserService', 'smsCode')
  async smsCode({ phone }: { phone: string }) {
    return await this.userService.smsCode(phone);
  }

  @GrpcMethod('UserService', 'Register')
  register(registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @GrpcMethod('UserService', 'InitData')
  async initData() {
    return await this.userService.initData();
  }

  @GrpcMethod('UserService', 'Login')
  async login(loginUserDto: LoginUserDto) {
    const vo = await this.userService.login(loginUserDto, false);

    vo.setAccessToken = this.jwtService.sign(
      {
        userId: vo.getUserInfo.id,
        username: vo.getUserInfo.username,
        roles: vo.getUserInfo.roles,
        permissions: vo.getUserInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    vo.setRefreshToken = this.jwtService.sign(
      {
        userId: vo.getUserInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
    return vo;
  }

  @GrpcMethod('UserService', 'ValidateSmsCode')
  async validateSmsCode({ phone, code }: { phone: string; code: string }) {
    return await this.userService.validateSmsCode(phone, code);
  }

  @GrpcMethod('UserService', 'ResetPassword')
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  @GrpcMethod('UserService', 'AdminLogin')
  async adminLogin(loginUserDto: LoginUserDto) {
    const vo = await this.userService.login(loginUserDto, true);

    vo.setAccessToken = this.jwtService.sign(
      {
        userId: vo.getUserInfo.id,
        username: vo.getUserInfo.username,
        roles: vo.getUserInfo.roles,
        permissions: vo.getUserInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    vo.setRefreshToken = this.jwtService.sign(
      {
        userId: vo.getUserInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
    return vo;
  }

  @GrpcMethod('UserService', 'Refresh')
  async refresh({ refreshToken }: { refreshToken: string }) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, false);
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
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

  @GrpcMethod('UserService', 'AdminRefresh')
  async adminRefresh({ refreshToken }: { refreshToken: string }) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, true);
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
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

  @GrpcMethod('UserService', 'Info')
  @RequireLogin()
  async info({ userId }: { userId: number }) {
    return await this.userService.findUserDetailById(userId);
  }
}
