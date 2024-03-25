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
import { ClientGrpc } from '@nestjs/microservices';
import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { JobService } from 'apps/boss/src/service/job.service';
import { GrpcExceptionFilter } from 'filters/rpc-exception.filter';

@Controller({
  path: 'job',
})
@UseFilters(GrpcExceptionFilter)
export class JobController {
  @Inject('category')
  private client: ClientGrpc;

  private jobService: JobService;

  onModuleInit() {
    this.jobService = this.client.getService('JobService');
  }

  @Post()
  create(@Body() jobDetail: JobDetail): Promise<JobDetail> {
    return this.jobService.create({
      jobDetail,
    });
  }

  @Get('all')
  findAll(): Promise<JobDetail[]> {
    return this.jobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') jobId: string): Promise<JobDetail> {
    return this.jobService.findOne({
      jobId: +jobId,
    });
  }

  @Put(':id')
  update(
    @Param('id') jobId: string,
    @Body() jobDetail: JobDetail,
  ): Promise<JobDetail> {
    return this.jobService.update({
      jobId: +jobId,
      jobDetail,
    });
  }

  @Delete(':id')
  remove(@Param('id') jobId: string): Promise<void> {
    return this.jobService.remove({
      jobId: +jobId,
    });
  }

  @Get('search')
  search(@Query('keyword') keyword: string): Promise<JobDetail[]> {
    return this.jobService.search({
      keyword,
    });
  }

  @Get('paginate')
  paginate(
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<JobDetail[]> {
    return this.jobService.paginate({
      page,
      take,
    });
  }
}
