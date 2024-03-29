import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/job',
})
export class JobController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Post()
  @RequireLogin()
  create(
    @UserInfo('userId') userId: number,
    @Body() jobDetail: JobDetail,
  ): Promise<JobDetail> {
    return firstValueFrom(
      this.BossClient.send('create', { userId, jobDetail }),
    );
  }

  @Get('all')
  async findAll(): Promise<{ jobDetail: JobDetail[] }> {
    return firstValueFrom(await this.BossClient.send('findAll', {}));
  }

  @Get(':id')
  @RequireLogin()
  findOne(
    @UserInfo('userId') userId: number,
    @Param('id') jobId: string,
  ): Promise<
    JobDetail & {
      isCollected: boolean;
    }
  > {
    return firstValueFrom(
      this.BossClient.send('findOne', { userId, jobId: +jobId }),
    );
  }

  @Put(':id')
  update(
    @Param('id') jobId: string,
    @Body() jobDetail: JobDetail,
  ): Promise<JobDetail> {
    return firstValueFrom(
      this.BossClient.send('update', {
        jobId: +jobId,
        jobDetail,
      }),
    );
  }

  @Delete(':id')
  remove(@Param('id') jobId: string): Promise<void> {
    return firstValueFrom(this.BossClient.send('remove', { jobId: +jobId }));
  }

  @Get('search')
  search(@Query('keyword') keyword: string): Promise<JobDetail[]> {
    return firstValueFrom(this.BossClient.send('search', { keyword }));
  }

  @Get('paginate')
  paginate(
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<JobDetail[]> {
    return firstValueFrom(this.BossClient.send('paginate', { page, take }));
  }
}
