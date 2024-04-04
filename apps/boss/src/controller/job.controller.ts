import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JobDetail } from '../entities/job.entity';
import { JobService } from '../service/job.service';

@Controller()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @MessagePattern('create')
  create({ userId, jobDetail }: { userId: number; jobDetail: JobDetail }) {
    return this.jobService.create({
      userId,
      jobDetail,
    });
  }

  @MessagePattern('findAll')
  findAll(parmas: JobDetail & Pagination) {
    return this.jobService.findAll(parmas);
  }

  @MessagePattern('findOne')
  findOne({ userId, jobId }: { userId: number; jobId: number }) {
    return this.jobService.findOne({
      jobId,
      userId,
    });
  }

  @MessagePattern('update')
  update({ jobId, jobDetail }: { jobId: number; jobDetail: JobDetail }) {
    return this.jobService.update({
      jobId,
      jobDetail,
    });
  }

  @MessagePattern('remove')
  remove({ jobId }: { jobId: number }) {
    return this.jobService.remove({
      jobId,
    });
  }

  @MessagePattern('search')
  search({ keyword }: { keyword: string }) {
    return this.jobService.search({
      keyword,
    });
  }

  @MessagePattern('paginate')
  paginate({ page, take }: { page: number; take: number }) {
    return this.jobService.paginate({
      page,
      take,
    });
  }
}
