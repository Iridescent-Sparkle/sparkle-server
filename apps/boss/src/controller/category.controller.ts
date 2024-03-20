import { Controller, Get, Param } from '@nestjs/common';
import { JobCategory } from '../entities/category.entity';
import { CategoryService } from '../service/category.service';

@Controller({
  path: 'category',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  findAllJobCategory(): Promise<JobCategory[]> {
    return this.categoryService.findAllJobCategory();
  }

  @Get('job/:id')
  findJobByCategory(@Param('categoryId') categoryId: number) {
    return this.categoryService.findJobByCategory(categoryId);
  }
}
