import * as OpenApi from '@alicloud/openapi-client';
import * as Sts20150401 from '@alicloud/sts20150401';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OssService } from './oss.service';

@Module({
  providers: [
    OssService,
    {
      inject: [ConfigService],
      provide: 'OSS_SERVICE',
      useFactory: (configService: ConfigService) => {
        const config = new OpenApi.Config({
          accessKeyId: configService.get('ALIBABA_CLOUD_ACCESS_KEY_ID'),
          accessKeySecret: configService.get('ALIBABA_CLOUD_ACCESS_KEY_SECRET'),
        });
        config.endpoint = `sts.cn-chengdu.aliyuncs.com`;
        return new Sts20150401.default(config);
      },
    },
  ],
  exports: [OssService],
})
export class OssModule {}
