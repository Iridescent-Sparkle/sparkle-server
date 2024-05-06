import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'apps/user/src/entities/user.entity';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'admin/custom-user',
})
export class CustomUserController {
  @Inject('ADMIN_SERVICE')
  private adminClient: ClientProxy;

  /** 获取用户信息 */
  @Post('all')
  // @RequireLogin()
  async findAllCustomUser(@Body() params: User & Pagination) {
    return firstValueFrom(this.adminClient.send('findAllCustomUser', params));
  }

  @Post('update')
  // @RequireLogin()
  async updateCustomUser(@Body() user: User) {
    return firstValueFrom(this.adminClient.send('updateCustomUser', user));
  }
}
