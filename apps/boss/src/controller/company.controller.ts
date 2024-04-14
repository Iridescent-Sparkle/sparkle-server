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
  findAllCompanyInfo(params: Company & Pagination) {
    return this.companyService.findAllCompanyInfo(params);
  }

  @MessagePattern('updateCompanyInfo')
  async updateCompanyInfo(params: Company) {
    return await this.companyService.updateCompanyInfo(params);
  }

  @MessagePattern('deleteCompanyInfo')
  async deleteCompanyInfo(params: Company) {
    return await this.companyService.deleteCompanyInfo(params);
  }
}
