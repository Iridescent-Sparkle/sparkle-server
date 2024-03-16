import { UserController as UserService } from './../../../user/src/user.controller';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { LoginUserDto } from 'apps/user/src/dto/login-user.dto';
import { RegisterUserDto } from 'apps/user/src/dto/register-user.dto';
import { ResetPasswordDto } from 'apps/user/src/dto/reset-password.dto';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { GrpcExceptionFilter } from 'filters/rpc-exception.filter';

@Controller({
  path: 'user',
})
@UseFilters(GrpcExceptionFilter)
export class UserController {
  @Inject('user')
  private client: ClientGrpc;

  private userService: UserService;

  onModuleInit() {
    this.userService = this.client.getService('UserService');
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    return await this.userService.captcha({ address });
  }

  @Get('register-smsCode')
  async smsCode(@Query('phone') phone: string) {
    return await this.userService.smsCode({ phone });
  }

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @Get('init-data')
  async initData() {
    return await this.userService.initData();
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  @Post('validateSmsCode')
  async validateSmsCode(@Body() params: { phone: string; code: string }) {
    return await this.userService.validateSmsCode(params);
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.adminLogin(loginUserDto);
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    return await this.userService.refresh({
      refreshToken,
    });
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    return await this.userService.adminRefresh({
      refreshToken,
    });
  }

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return await this.userService.info({ userId });
  }
}
