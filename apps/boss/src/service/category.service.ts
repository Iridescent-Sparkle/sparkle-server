import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { JobCategory } from '../entities/category.entity';
import { JobDetail } from '../entities/job.entity';

@Injectable()
export class CategoryService {
  @InjectRepository(JobDetail)
  private jobDetailRepository: Repository<JobDetail>;

  @InjectRepository(JobCategory)
  private jobCategoryRepository: Repository<JobCategory>;

  constructor() {}

  async initJobCategory() {
    const jobCategoryOptions = [
      {
        label: '不限',
        value: '0',
      },
      {
        label: '互联网/AI',
        value: '1',
      },
      {
        label: '电子/电气/通信',
        value: '2',
      },
      {
        label: '产品',
        value: '3',
      },
      {
        label: '客服/运营',
        value: '4',
      },
      {
        label: '销售',
        value: '5',
      },
      {
        label: '财务/审计/税务',
        value: '6',
      },
      {
        label: '生产制造',
        value: '7',
      },
      {
        label: '零售/生活服务',
        value: '8',
      },
      {
        label: '餐饮',
        value: '9',
      },
      {
        label: '酒店/旅游',
        value: '10',
      },
      {
        label: '教育培训',
        value: '11',
      },
      {
        label: '设计',
        value: '12',
      },
      {
        label: '房地产/建筑',
        value: '13',
      },
      {
        label: '直播/影视/传媒',
        value: '14',
      },
      {
        label: '市场/公关/广告',
        value: '15',
      },
      {
        label: '物流/仓储/司机',
        value: '16',
      },
      {
        label: '采购/贸易',
        value: '17',
      },
      {
        label: '汽车',
        value: '18',
      },
      {
        label: '医疗健康',
        value: '19',
      },
      {
        label: '金融',
        value: '20',
      },
      {
        label: '咨询/翻译/法律',
        value: '21',
      },
      {
        label: '能源/环保/农业',
        value: '22',
      },
      {
        label: '高级管理',
        value: '23',
      },
      {
        label: '其他',
        value: '24',
      },
    ];
    for await (const item of jobCategoryOptions) {
      const jobCategory = new JobCategory();
      jobCategory.categoryName = item.label;
      await this.jobCategoryRepository.save(jobCategory);
    }
    return {};
  }

  async findAllJobCategory(params: JobCategory & Pagination) {
    const { page = 1, pageSize = 10, isFrozen = false, ...rest } = params;
    const condition: Record<string, any> = {};
    if (rest.categoryName) {
      condition.categoryName = Like(`%${rest.categoryName}%`);
    }

    if (rest.categoryDescription) {
      condition.categoryDescription = Like(`%${rest.categoryDescription}%`);
    }

    if (rest.createStart && rest.createEnd) {
      condition.createTime = Between(
        new Date(rest.createStart),
        new Date(new Date(rest.createEnd).getTime() + 60 * 60),
      );
    }

    if (rest.updateStart && rest.updateEnd) {
      condition.updateTime = Between(
        new Date(rest.updateStart),
        new Date(new Date(rest.updateEnd).getTime() + 60 * 60),
      );
    }

    const [data, total] = await this.jobCategoryRepository.findAndCount({
      where: {
        isDelete: false,
        isFrozen,
        ...condition,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async findJobByCategory(params: { categoryId: number } & Pagination) {
    const { categoryId, page = 1, pageSize = 10 } = params;

    const condition = {} as Record<string, any>;

    if (categoryId != 1) {
      condition.jobCategory = {
        id: categoryId,
      };
    }

    const [data, total] = await this.jobDetailRepository.findAndCount({
      where: {
        isDelete: false,
        ...condition,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async updateJobCategory(params: JobCategory) {
    await this.jobCategoryRepository.update(params.id, params);
  }
}
