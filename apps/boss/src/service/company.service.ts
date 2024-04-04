import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyService {
  @InjectRepository(Company)
  private companyRepository: Repository<Company>;

  constructor() {}

  async createCompanyInfo(company: Company) {
    await this.companyRepository.save(company);
  }

  async findAllCompanyInfo(parmas: Company & Pagination) {
    const { page = 1, pageSize = 10, ...rest } = parmas;
    const condition: Record<string, any> = {};
    if (rest.companyName) {
      condition.companyName = Like(`%${rest.companyName}%`);
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

    const [data, total] = await this.companyRepository.findAndCount({
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

  async updateCompanyInfo(params: Company) {
    await this.companyRepository.update(params.id, params);
  }
}