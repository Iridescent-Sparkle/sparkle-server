import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JobCategory } from 'apps/boss/src/entities/category.entity';
import { CategoryService } from 'apps/boss/src/service/category.service';

@Controller({
  path: 'category',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('findAllJobCategory')
  findAllJobCategory(): Promise<JobCategory[]> {
    return this.categoryService.findAllJobCategory();
  }

  @MessagePattern('findJobByCategory')
  findJobByCategory({ categoryId }: { categoryId: number }) {
    return this.categoryService.findJobByCategory({ categoryId });
  }
}
