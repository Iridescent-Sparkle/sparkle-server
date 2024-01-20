import { Module } from '@nestjs/common';
import { MyLogger } from './logger';

export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';

@Module({})
export class WinstonModule {
  public static forRoot(options) {
    return {
      module: WinstonModule,
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN,
          useValue: new MyLogger(options),
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    };
  }
}
