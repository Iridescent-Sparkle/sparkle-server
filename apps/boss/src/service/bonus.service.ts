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
    const { page = 1, pageSize = 10, isDelete = false, ...rest } = params;

    const condition: Record<string, any> = {
      isDelete,
    };

    if (rest.bonusName) {
      condition.bonusName = Like(`%${rest.bonusName}%`);
    }

    if (rest.bonusDescription) {
      condition.bonusDescription = Like(`%${rest.bonusDescription}%`);
    }

    if (rest.createTime) {
      condition.createTime = Between(
        new Date(rest.createTime[0]),
        new Date(rest.createTime[1]),
      );
    }

    if (rest.updateTime) {
      condition.updateTime = Between(
        new Date(rest.updateTime[0]),
        new Date(rest.updateTime[1]),
      );
    }

    if (rest.isFrozen !== undefined) {
      condition.isFrozen = rest.isFrozen;
    }

    const [data, total] = await this.jobBonusRepository.findAndCount({
      where: condition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        updateTime: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async createJobBonus(params: JobBonus) {
    if (params.bonusName) {
      const jobBonus = await this.jobBonusRepository.findOne({
        where: {
          bonusName: params.bonusName,
        },
      });

      if (jobBonus) {
        return {
          message: '该记录已存在',
        };
      }
    }
    const jobBonus = new JobBonus();
    jobBonus.bonusName = params.bonusName;
    jobBonus.bonusDescription = params.bonusDescription;

    return await this.jobBonusRepository.save(jobBonus);
  }

  async updateJobBonus(params: JobBonus) {
    const jobBonus = await this.jobBonusRepository.findOne({
      where: {
        id: params.id,
        isDelete: false,
      },
    });

    if (!jobBonus) {
      return {
        message: '该记录不存在',
      };
    }

    return await this.jobBonusRepository.save({
      ...jobBonus,
      ...params,
    });
  }

  async deleteJobBonus(params: JobBonus) {
    const jobBonus = await this.jobBonusRepository.findOne({
      where: {
        id: params.id,
        isDelete: false,
      },
    });

    if (!jobBonus) {
      return {
        message: '该记录不存在',
      };
    }

    return await this.jobBonusRepository.save({
      ...jobBonus,
      isDelete: true,
    });
  }
}
