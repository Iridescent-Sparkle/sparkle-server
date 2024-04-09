import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JobCategory } from 'apps/boss/src/entities/category.entity';
import { CategoryService } from 'apps/boss/src/service/category.service';

@Controller({})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('initJobCategory')
  initJobCategory() {
    return this.categoryService.initJobCategory();
  }

  @MessagePattern('findAllJobCategory')
  findAllJobCategory(params: JobCategory & Pagination) {
    return this.categoryService.findAllJobCategory(params);
  }

  @MessagePattern('findJobByCategory')
  findJobByCategory(params: { categoryId: number } & Pagination) {
    return this.categoryService.findJobByCategory(params);
  }

  @MessagePattern('updateJobCategory')
  async updateJobCategory(params: JobCategory) {
    return await this.categoryService.updateJobCategory(params);
  }
}
