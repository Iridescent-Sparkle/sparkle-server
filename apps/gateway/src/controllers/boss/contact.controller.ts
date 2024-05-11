import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Contact } from 'apps/boss/src/entities/contact.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/contact',
})
export class ContactController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Post('user')
  @RequireLogin()
  findContactByUserId(
    @UserInfo('userId') userId: number,
    @Body() params: Pagination,
  ) {
    return firstValueFrom(
      this.BossClient.send('findContactByUserId', {
        userId,
        ...params,
      }),
    );
  }

  @Post('create')
  @RequireLogin()
  createContact(@UserInfo('userId') userId: number, @Body() params: Contact) {
    return firstValueFrom(
      this.BossClient.send('createContact', {
        userId,
        ...params,
      }),
    );
  }
}
