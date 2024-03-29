import { Controller, Get, Inject, Param, UseFilters } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JobCategory } from 'apps/boss/src/entities/category.entity';
import { RequireLogin } from 'decorators/custom.decorator';
import { GrpcExceptionFilter } from 'filters/rpc-exception.filter';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/category',
})
@UseFilters(GrpcExceptionFilter)
export class CategoryController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Get('init')
  async initJobCategory() {
    return firstValueFrom(await this.BossClient.send('initJobCategory', {}));
  }

  @Get('all')
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
