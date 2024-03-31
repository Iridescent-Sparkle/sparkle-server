import { Controller, Get, Inject, Param } from '@nestjs/common';
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

  @Get('all')
  @RequireLogin()
  findAllJobCategory(): Promise<JobCategory[]> {
    return firstValueFrom(this.BossClient.send('findAllJobCategory', {}));
  }

  @Get('job/:id')
  @RequireLogin()
  findJobByCategory(@Param('id') categoryId: number) {
    return firstValueFrom(
      this.BossClient.send('findJobByCategory', { categoryId }),
    );
  }
}
