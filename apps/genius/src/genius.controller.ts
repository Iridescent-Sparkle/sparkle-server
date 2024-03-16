import { Controller, Get } from '@nestjs/common';
import { GeniusService } from './genius.service';

@Controller()
export class GeniusController {
  constructor(private readonly geniusService: GeniusService) {}

  @Get()
  getHello(): string {
    return this.geniusService.getHello();
  }
}
