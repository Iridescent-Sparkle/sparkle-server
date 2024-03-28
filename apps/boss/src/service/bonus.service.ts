import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAllJobBonus(): Promise<JobBonus[]> {
    return await this.jobBonusRepository.find();
  }
}
