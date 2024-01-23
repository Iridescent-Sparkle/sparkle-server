import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
  getHello(): string {
    return 'Hello World!';
  }
}
