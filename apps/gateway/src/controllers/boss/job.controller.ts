import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
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

  @Post('create')
  @RequireLogin()
  createJobDetail(
    @UserInfo('userId') userId: number,
    @Body() jobDetail: JobDetail,
  ): Promise<JobDetail> {
    return firstValueFrom(
      this.BossClient.send('createJobDetail', { userId, jobDetail }),
    );
  }

  @Post('all')
  @RequireLogin()
  async findAll(
    @Body() params: JobDetail & Pagination,
  ): Promise<{ jobDetail: JobDetail[] }> {
    return firstValueFrom(await this.BossClient.send('findAll', params));
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

  @Post('update')
  @RequireLogin()
  update(
    @UserInfo('userId') userId: number,
    @Body() jobDetail: JobDetail,
  ): Promise<JobDetail> {
    return firstValueFrom(
      this.BossClient.send('update', {
        userId,
        jobDetail,
      }),
    );
  }

  @Post('remove')
  @RequireLogin()
  remove(@Body() params: { jobId: string }): Promise<void> {
    return firstValueFrom(this.BossClient.send('remove', params));
  }

  @Post('deliver')
  @RequireLogin()
  findDeliverByJobId(@Body() params: { jobId: string }): Promise<void> {
    return firstValueFrom(this.BossClient.send('findDeliverByJobId', params));
  }
}
