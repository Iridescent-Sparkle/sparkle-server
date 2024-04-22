import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { LoginUserDto } from 'apps/user/src/dto/login-user.dto';
import { RegisterUserDto } from 'apps/user/src/dto/register-user.dto';
import { ResetPasswordDto } from 'apps/user/src/dto/reset-password.dto';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { UserController as UserService } from '../../../../user/src/user.controller';
import { User } from 'apps/user/src/entities/user.entity';
import { Company } from 'apps/boss/src/entities/company.entity';

@Controller({
  path: 'user',
})
export class UserController {
  @Inject('user')
  private client: ClientGrpc;

  private userService: UserService;

  onModuleInit() {
    this.userService = this.client.getService('UserService');
  }

  @Get('sts')
  @RequireLogin()
  async getStsToken() {
    return await this.userService.getStsToken({});
  }

  @Get('register-emailCode')
  async emailCode(@Query('email') email: string) {
    return await this.userService.emailCode({ email });
  }

  @Get('register-smsCode')
  async smsCode(@Query('phone') phone: string) {
    return await this.userService.smsCode({ phone });
  }

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  @Post('reset/password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  @Post('validate/sms')
  @RequireLogin()
  async validateSmsCode(@Body() params: { phone: string; code: string }) {
    return await this.userService.validateSmsCode(params);
  }

  @Post('validate/email')
  @RequireLogin()
  async validateEmailCode(@Body() params: { email: string; code: string }) {
    return await this.userService.validateEmailCode(params);
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    return await this.userService.refresh({
      refreshToken,
    });
  }

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return await this.userService.info({ userId });
  }

  @Post('update')
  @RequireLogin()
  async update(@Body() user: User) {
    return await this.userService.update(user);
  }

  @Post('email/bind')
  @RequireLogin()
  async bindEmail(
    @UserInfo('userId') userId: number,
    @Body() params: { email: string; code: string },
  ) {
    return await this.userService.bindEmail({
      userId,
      ...params,
    });
  }

  @Post('company/create')
  @RequireLogin()
  async createCompanyInfo(
    @UserInfo('userId') userId: number,
    @Body() company: Company,
  ) {
    return await this.userService.createCompanyInfo({
      userId,
      company,
    });
  }

  @Post('im/users')
  @RequireLogin()
  async findImUsers(@Body() params: { userIds: string[] }) {
    const { userIds } = params;

    return await this.userService.findImUsers({
      userIds,
    });
  }
}
