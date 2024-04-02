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
  findAllJobCategory(parmas: JobCategory & Pagination) {
    return this.categoryService.findAllJobCategory(parmas);
  }

  @MessagePattern('findJobByCategory')
  findJobByCategory({ categoryId }: { categoryId: number }) {
    return this.categoryService.findJobByCategory({ categoryId });
  }

  @MessagePattern('updateJobCategory')
  async updateJobCategory(params: JobCategory) {
    await this.categoryService.updateJobCategory(params);
  }
}
