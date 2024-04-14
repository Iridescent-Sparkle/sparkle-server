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
    const newCompany = new Company();
    newCompany.companyName = company.companyName;
    newCompany.companyAvatar = company.companyAvatar;
    newCompany.companyLicense = company.companyLicense;
    newCompany.companyDesc = company.companyDesc;
    newCompany.status = company.status;
    return await this.companyRepository.save(newCompany);
  }

  async findAllCompanyInfo(params: Company & Pagination) {
    const { page = 1, pageSize = 10, ...rest } = params;
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
    const companyInfo = await this.companyRepository.findOne({
      where: {
        id: params.id,
        isDelete: false,
      },
    });

    if (!companyInfo) {
      return {
        message: '该记录不存在',
      };
    }

    return await this.companyRepository.save({
      ...companyInfo,
      ...params,
    });
  }

  async deleteCompanyInfo(params: Company) {
    const companyInfo = await this.companyRepository.findOne({
      where: {
        id: params.id,
        isDelete: false,
      },
    });

    if (!companyInfo) {
      return {
        message: '该记录不存在',
      };
    }

    return await this.companyRepository.save({
      ...companyInfo,
      isDelete: true,
    });
  }
}
