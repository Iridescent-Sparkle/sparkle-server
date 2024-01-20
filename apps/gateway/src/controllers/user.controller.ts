import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { LoginUserDto } from 'apps/user/src/dto/login-user.dto';
import { RegisterUserDto } from 'apps/user/src/dto/register-user.dto';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';

interface UserService {
  captcha(params: any): any;
  register(params: any): any;
  initData(params: any): any;
  login(params: any): any;
  adminLogin(params: any): any;
  adminLogin(params: any): any;
  refresh(params: any): any;
  adminRefresh(params: any): any;
  info(params: any): any;
}
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

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    return await this.userService.captcha({ address });
  }
  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @Get('init-data')
  async initData() {
    return await this.userService.initData({});
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
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
