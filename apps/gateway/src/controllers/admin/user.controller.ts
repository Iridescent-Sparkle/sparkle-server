import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserDto } from 'apps/admin/src/dto/login-user.dto';
import { RegisterUserDto } from 'apps/admin/src/dto/register-user.dto';
import { ResetPasswordDto } from 'apps/admin/src/dto/reset-password.dto';
import { AdminUser } from 'apps/admin/src/entities/user.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'admin/user',
})
export class UserController {
  @Inject('ADMIN_SERVICE')
  private adminClient: ClientProxy;

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    return firstValueFrom(this.adminClient.send('captcha', address));
  }

  @Get('register-smsCode')
  async smsCode(@Query('phone') phone: string) {
    return firstValueFrom(this.adminClient.send('smsCode', phone));
  }

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return firstValueFrom(this.adminClient.send('register', registerUser));
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return firstValueFrom(
      this.adminClient.send('resetPassword', resetPasswordDto),
    );
  }

  @Post('validateSmsCode')
  async validateSmsCode(@Body() params: { phone: string; code: string }) {
    return firstValueFrom(this.adminClient.send('validateSmsCode', params));
  }

  @Post('login')
  async adminLogin(@Body() loginUserDto: LoginUserDto) {
    return firstValueFrom(this.adminClient.send('adminLogin', loginUserDto));
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    return firstValueFrom(this.adminClient.send('refresh', refreshToken));
  }

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return firstValueFrom(this.adminClient.send('info', userId));
  }

  @Post('update')
  @RequireLogin()
  async update(@Body() user: AdminUser) {
    return firstValueFrom(this.adminClient.send('update', user));
  }

  @Get('sts')
  @RequireLogin()
  async getStsToken() {
    return firstValueFrom(this.adminClient.send('sts', {}));
  }
}
