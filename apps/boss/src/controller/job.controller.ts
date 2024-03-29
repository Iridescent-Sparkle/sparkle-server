import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JobDetail } from '../entities/job.entity';
import { JobService } from '../service/job.service';

@Controller()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @MessagePattern('create')
  create({ jobDetail }: { jobDetail: JobDetail }): Promise<JobDetail> {
    console.log(jobDetail);
    return this.jobService.create({
      jobDetail,
    });
  }

  @MessagePattern('findAll')
  findAll({}: object): Promise<{ jobDetail: JobDetail[] }> {
    return this.jobService.findAll({});
  }

  @MessagePattern('findOne')
  findOne({ jobId }: { jobId: number }): Promise<JobDetail> {
    return this.jobService.findOne({
      jobId,
    });
  }

  @MessagePattern('update')
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

  @MessagePattern('remove')
  remove({ jobId }: { jobId: number }): Promise<void> {
    return this.jobService.remove({
      jobId,
    });
  }

  @MessagePattern('search')
  search({ keyword }: { keyword: string }): Promise<JobDetail[]> {
    return this.jobService.search({
      keyword,
    });
  }

  @MessagePattern('paginate')
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
