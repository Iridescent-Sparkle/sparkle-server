import { Injectable } from '@nestjs/common';

@Injectable()
export class GeniusService {
  getHello(): string {
    return 'Hello World!';
  }
}
