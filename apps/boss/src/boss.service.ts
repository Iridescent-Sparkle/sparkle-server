import { Injectable } from '@nestjs/common';

@Injectable()
export class BossService {
  getHello(): string {
    return 'Hello World!';
  }
}
