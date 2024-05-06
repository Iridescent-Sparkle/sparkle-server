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
    const { current = 1, pageSize = 10, ...rest } = params;

    const condition: Record<string, any> = {
      isDelete: false,
    };

    if (rest.companyName) {
      condition.companyName = Like(`%${rest.companyName}%`);
    }
    if (rest.companyDesc) {
      condition.companyDesc = Like(`%${rest.companyDesc}%`);
    }

    if (rest.status !== undefined) {
      condition.status = rest.status;
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

    const [data, total] = await this.companyRepository.findAndCount({
      where: condition,
      skip: (current - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      current,
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
