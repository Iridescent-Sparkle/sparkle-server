import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { JobDetail } from '../entities/job.entity';
import { JobService } from '../service/job.service';

@Controller({
  path: 'job',
})
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  create(@Body() jobDetail: JobDetail): Promise<JobDetail> {
    return this.jobService.create(jobDetail);
  }

  @Get('all')
  findAll(): Promise<JobDetail[]> {
    return this.jobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<JobDetail> {
    return this.jobService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() jobDetail: JobDetail,
  ): Promise<JobDetail> {
    return this.jobService.update(+id, jobDetail);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.jobService.remove(+id);
  }

  @Get('search')
  search(@Query('keyword') keyword: string): Promise<JobDetail[]> {
    return this.jobService.search(keyword);
  }

  @Get('paginate')
  paginate(
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<JobDetail[]> {
    return this.jobService.paginate(page, take);
  }
}
