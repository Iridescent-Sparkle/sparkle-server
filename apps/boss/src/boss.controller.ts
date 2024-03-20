import { JobCategory } from './entities/category.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Delete,
  Post,
} from '@nestjs/common';
import { BossService } from './boss.service';
import { JobDetail } from './entities/job.entity';

@Controller({
  path: 'job',
})
export class BossController {
  constructor(private readonly bossService: BossService) {}

  @Post()
  create(@Body() jobDetail: JobDetail): Promise<JobDetail> {
    return this.bossService.create(jobDetail);
  }

  @Get('all')
  findAll(): Promise<JobDetail[]> {
    return this.bossService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<JobDetail> {
    return this.bossService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() jobDetail: JobDetail,
  ): Promise<JobDetail> {
    return this.bossService.update(+id, jobDetail);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.bossService.remove(+id);
  }

  @Get('search')
  search(@Query('keyword') keyword: string): Promise<JobDetail[]> {
    return this.bossService.search(keyword);
  }

  @Get('paginate')
  paginate(
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<JobDetail[]> {
    return this.bossService.paginate(page, take);
  }

  @Post('jobCategory')
  findAllJobCategory(): Promise<JobCategory[]> {
    return this.bossService.findAllJobCategory();
  }

  @Post('jobByCategory')
  findJobByCategory(@Body('categoryId') categoryId: number) {
    return this.bossService.findJobByCategory(categoryId);
  }
}
