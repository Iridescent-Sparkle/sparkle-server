import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Company } from 'apps/boss/src/entities/company.entity';
import { CompanyService } from 'apps/boss/src/service/company.service';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @MessagePattern('createCompanyInfo')
  createCompanyInfo(company: Company) {
    return this.companyService.createCompanyInfo(company);
  }

  @MessagePattern('findAllCompanyInfo')
  findAllCompanyInfo(parmas: Company & Pagination) {
    return this.companyService.findAllCompanyInfo(parmas);
  }

  @MessagePattern('updateCompanyInfo')
  async updateCompanyInfo(params: Company) {
    await this.companyService.updateCompanyInfo(params);
  }
}