import { Body, Controller, Param, Query } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { JobDetail } from '../entities/job.entity';
import { JobService } from '../service/job.service';

@Controller({
  path: 'job',
})
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @GrpcMethod('JobService', 'Create')
  create(@Body() jobDetail: JobDetail): Promise<JobDetail> {
    return this.jobService.create(jobDetail);
  }

  @GrpcMethod('JobService', 'FindAll')
  findAll(): Promise<JobDetail[]> {
    return this.jobService.findAll();
  }

  @GrpcMethod('JobService', 'FindOne')
  findOne(@Param('id') id: string): Promise<JobDetail> {
    return this.jobService.findOne(+id);
  }

  @GrpcMethod('JobService', 'Update')
  update(
    @Param('id') id: string,
    @Body() jobDetail: JobDetail,
  ): Promise<JobDetail> {
    return this.jobService.update(+id, jobDetail);
  }

  @GrpcMethod('JobService', 'Remove')
  remove(@Param('id') id: string): Promise<void> {
    return this.jobService.remove(+id);
  }

  @GrpcMethod('JobService', 'Search')
  search(@Query('keyword') keyword: string): Promise<JobDetail[]> {
    return this.jobService.search(keyword);
  }

  @GrpcMethod('JobService', 'Paginate')
  paginate(
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<JobDetail[]> {
    return this.jobService.paginate(page, take);
  }
}
