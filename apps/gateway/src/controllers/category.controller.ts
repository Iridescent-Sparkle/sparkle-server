import { Controller, Get, Inject, Param, UseFilters } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcExceptionFilter } from 'filters/rpc-exception.filter';
import { JobCategory } from 'apps/boss/src/entities/category.entity';
import { CategoryService } from 'apps/boss/src/service/category.service';

@Controller({
  path: 'category',
})
@UseFilters(GrpcExceptionFilter)
export class CategoryController {
  @Inject('category')
  private client: ClientGrpc;

  private categoryService: CategoryService;

  onModuleInit() {
    this.categoryService = this.client.getService('CategoryService');
  }

  @Get('all')
  findAllJobCategory(): Promise<JobCategory[]> {
    return this.categoryService.findAllJobCategory();
  }

  @Get('job/:id')
  findJobByCategory(@Param('categoryId') categoryId: number) {
    return this.categoryService.findJobByCategory({ categoryId });
  }
}
