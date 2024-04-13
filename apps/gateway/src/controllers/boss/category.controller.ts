import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JobCategory } from 'apps/boss/src/entities/category.entity';
import { RequireLogin } from 'decorators/custom.decorator';

import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/category',
})
export class CategoryController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Get('init')
  @RequireLogin()
  async initJobCategory() {
    return firstValueFrom(await this.BossClient.send('initJobCategory', {}));
  }

  @Post('all')
  @RequireLogin()
  findAllJobCategory(@Body() params: JobCategory & Pagination) {
    return firstValueFrom(this.BossClient.send('findAllJobCategory', params));
  }

  @Post('job')
  @RequireLogin()
  findJobByCategory(@Body() params: { categoryId: number } & Pagination) {
    return firstValueFrom(this.BossClient.send('findJobByCategory', params));
  }

  @Post('create')
  @RequireLogin()
  createJobCategory(@Body() params: JobCategory) {
    return firstValueFrom(this.BossClient.send('createJobCategory', params));
  }

  @Post('update')
  @RequireLogin()
  updateJobCategory(@Body() params: JobCategory) {
    return firstValueFrom(this.BossClient.send('updateJobCategory', params));
  }

  @Post('delete')
  @RequireLogin()
  deleteJobCategory(@Body() params: JobCategory) {
    return firstValueFrom(this.BossClient.send('deleteJobCategory', params));
  }
}
