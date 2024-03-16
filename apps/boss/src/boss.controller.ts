import { Controller, Get } from '@nestjs/common';
import { BossService } from './boss.service';

@Controller()
export class BossController {
  constructor(private readonly bossService: BossService) {}

  @Get()
  getHello(): string {
    return this.bossService.getHello();
  }
}
