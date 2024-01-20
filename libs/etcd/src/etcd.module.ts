import { DynamicModule, Module } from '@nestjs/common';
import { Etcd3, IOptions } from 'etcd3';
import { EtcdService } from './etcd.service';

export interface EtcdModuleAsyncOptions {
  useFactory?: (...args: any[]) => Promise<IOptions> | IOptions;
  inject?: any[];
}

export const ETCD_CLIENT_TOKEN = 'ETCD_CLIENT';

export const ETCD_CLIENT_OPTIONS_TOKEN = 'ETCD_CLIENT_OPTIONS';

@Module({})
export class EtcdModule {
  public static forRoot(options?: IOptions): DynamicModule {
    return {
      module: EtcdModule,
      providers: [
        EtcdService,
        {
          provide: ETCD_CLIENT_OPTIONS_TOKEN,
          useValue: options,
        },
        {
          provide: ETCD_CLIENT_TOKEN,
          useFactory(options: IOptions) {
            const client = new Etcd3(options);
            return client;
          },
          inject: [ETCD_CLIENT_OPTIONS_TOKEN],
        },
      ],
      exports: [EtcdService],
    };
  }
  public static forRootAsync(options: EtcdModuleAsyncOptions): DynamicModule {
    return {
      module: EtcdModule,
      providers: [
        EtcdService,
        {
          provide: ETCD_CLIENT_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: ETCD_CLIENT_TOKEN,
          useFactory(options: IOptions) {
            const client = new Etcd3(options);
            return client;
          },
          inject: [ETCD_CLIENT_OPTIONS_TOKEN],
        },
      ],
      exports: [EtcdService],
    };
  }
}
