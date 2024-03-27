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
  UseFilters,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { GrpcExceptionFilter } from 'filters/rpc-exception.filter';

@Controller({
  path: 'job',
})
@UseFilters(GrpcExceptionFilter)
export class JobController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Post()
  create(@Body() jobDetail: JobDetail): Promise<JobDetail> {
    return this.BossClient.send('create', { jobDetail }).toPromise();
  }

  @Get('all')
  async findAll(): Promise<{ jobDetail: JobDetail[] }> {
    return await this.BossClient.send('findAll', {}).toPromise();
  }

  @Get(':id')
  findOne(@Param('id') jobId: string): Promise<JobDetail> {
    return this.BossClient.send('findOne', { jobId: +jobId }).toPromise();
  }

  @Put(':id')
  update(
    @Param('id') jobId: string,
    @Body() jobDetail: JobDetail,
  ): Promise<JobDetail> {
    return this.BossClient.send('update', {
      jobId: +jobId,
      jobDetail,
    }).toPromise();
  }

  @Delete(':id')
  remove(@Param('id') jobId: string): Promise<void> {
    return this.BossClient.send('remove', { jobId: +jobId }).toPromise();
  }

  @Get('search')
  search(@Query('keyword') keyword: string): Promise<JobDetail[]> {
    return this.BossClient.send('search', { keyword }).toPromise();
  }

  @Get('paginate')
  paginate(
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<JobDetail[]> {
    return this.BossClient.send('paginate', { page, take }).toPromise();
  }
}
