import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { JobBonus } from '../entities/bonus.entity';

@Injectable()
export class BonusService {
  @InjectRepository(JobBonus)
  private jobBonusRepository: Repository<JobBonus>;

  constructor() {}

  async initJobBonus() {
    const jobBonusOptions = [
      {
        label: '餐饮及下午茶',
        value: 'cyjxwc',
      },
      {
        label: '就近租房补贴',
        value: 'jjzfbt',
      },
      {
        label: '节日礼品',
        value: 'jrlp',
      },
      {
        label: '年度体检',
        value: 'ndtj',
      },
      {
        label: '免费健身设施',
        value: 'mfjsss',
      },
      {
        label: '家庭关爱假',
        value: 'jtgaj',
      },
      {
        label: '家庭自选保险',
        value: 'jtzxbx',
      },
      {
        label: '住房补贴',
        value: 'zfbt',
      },
      {
        label: '团建聚餐',
        value: 'tjzc',
      },
      {
        label: '零食下午茶',
        value: 'lsxwc',
      },
      {
        label: '餐补',
        value: 'cb',
      },
      {
        label: '带薪年假',
        value: 'dxnj',
      },
      {
        label: '夜班补助',
        value: 'ybbz',
      },
      {
        label: '股票期权',
        value: 'gpqq',
      },
      {
        label: '绩效奖金',
        value: 'jxjj',
      },
      {
        label: '年终奖',
        value: 'nzj',
      },
      {
        label: '定期体检',
        value: 'dqtj',
      },
      {
        label: '意外险',
        value: 'ywx',
      },
      {
        label: '补充医疗保险',
        value: 'bcylbx',
      },
      {
        label: '五险一金',
        value: 'wxyj',
      },
    ];
    for await (const item of jobBonusOptions) {
      const jobBonus = new JobBonus();
      jobBonus.bonusName = item.label;
      await this.jobBonusRepository.save(jobBonus);
    }
    return {};
  }

  async findAllJobBonus(params: JobBonus & Pagination) {
    const { page = 1, pageSize = 10, isFrozen = false, ...rest } = params;

    const condition: Record<string, any> = {};

    if (rest.bonusName) {
      condition.bonusName = Like(`%${rest.bonusName}%`);
    }

    if (rest.bonusDescription) {
      condition.bonusDescription = Like(`%${rest.bonusDescription}%`);
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

    const [data, total] = await this.jobBonusRepository.findAndCount({
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

  async updateJobBonus(params: JobBonus) {
    await this.jobBonusRepository.update(params.id, params);
  }
}
