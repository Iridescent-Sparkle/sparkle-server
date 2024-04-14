import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Company } from 'apps/boss/src/entities/company.entity';
import { RequireLogin } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/company',
})
export class CompanyController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Post('all')
  @RequireLogin()
  findAllCompanyInfo(@Body() params: Company & Pagination) {
    return firstValueFrom(this.BossClient.send('findAllCompanyInfo', params));
  }

  @Post('create')
  @RequireLogin()
  createCompanyInfo(@Body() params: Company) {
    return firstValueFrom(this.BossClient.send('createCompanyInfo', params));
  }

  @Post('update')
  @RequireLogin()
  updateCompanyInfo(@Body() params: Company) {
    return firstValueFrom(this.BossClient.send('updateCompanyInfo', params));
  }

  @Post('delete')
  @RequireLogin()
  deleteCompanyInfo(@Body() params: Company) {
    return firstValueFrom(this.BossClient.send('deleteCompanyInfo', params));
  }
}
