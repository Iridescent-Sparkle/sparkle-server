import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { JobCategory } from 'apps/boss/src/entities/category.entity';
import { CategoryService } from 'apps/boss/src/service/category.service';

@Controller({
  path: 'category',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @GrpcMethod('CategoryService', 'FindAllJobCategory')
  findAllJobCategory(): Promise<JobCategory[]> {
    return this.categoryService.findAllJobCategory();
  }

  @GrpcMethod('CategoryService', 'FindJobByCategory')
  findJobByCategory({ categoryId }: { categoryId: number }) {
    return this.categoryService.findJobByCategory({ categoryId });
  }
}
