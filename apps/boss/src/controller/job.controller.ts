import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { JobDetail } from '../entities/job.entity';
import { JobService } from '../service/job.service';

@Controller()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @GrpcMethod('JobService', 'Create')
  create({ jobDetail }: { jobDetail: JobDetail }): Promise<JobDetail> {
    return this.jobService.create({
      jobDetail,
    });
  }

  @GrpcMethod('JobService', 'FindAll')
  findAll({}: object): Promise<{ jobDetail: JobDetail[] }> {
    return this.jobService.findAll({});
  }

  @GrpcMethod('JobService', 'FindOne')
  findOne({ jobId }: { jobId: number }): Promise<JobDetail> {
    return this.jobService.findOne({
      jobId,
    });
  }

  @GrpcMethod('JobService', 'Update')
  update({
    jobId,
    jobDetail,
  }: {
    jobId: number;
    jobDetail: JobDetail;
  }): Promise<JobDetail> {
    return this.jobService.update({
      jobId,
      jobDetail,
    });
  }

  @GrpcMethod('JobService', 'Remove')
  remove({ jobId }: { jobId: number }): Promise<void> {
    return this.jobService.remove({
      jobId,
    });
  }

  @GrpcMethod('JobService', 'Search')
  search({ keyword }: { keyword: string }): Promise<JobDetail[]> {
    return this.jobService.search({
      keyword,
    });
  }

  @GrpcMethod('JobService', 'Paginate')
  paginate({
    page,
    take,
  }: {
    page: number;
    take: number;
  }): Promise<JobDetail[]> {
    return this.jobService.paginate({
      page,
      take,
    });
  }
}
