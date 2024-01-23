import { Controller, Get } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';

@Controller()
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  getHello(): string {
    return this.configurationService.getHello();
  }
}
