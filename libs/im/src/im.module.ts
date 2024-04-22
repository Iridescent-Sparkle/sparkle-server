import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ImService } from './im.service';

@Module({
  imports: [HttpModule],
  providers: [
    ImService,
    {
      inject: [ConfigService, HttpService],
      provide: 'IM_CLIENT',
      useFactory: async (
        configService: ConfigService,
        httpService: HttpService,
      ) => {
        const { data } = await firstValueFrom(
          httpService.post(
            `https://${configService.get('im_host')}/${configService.get(
              'im_org_name',
            )}/${configService.get('im_app_name')}/token`,
            {
              grant_type: 'client_credentials',
              client_id: configService.get('im_client_key'),
              client_secret: configService.get('im_client_secret'),
              ttl: 0,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            },
          ),
        );
        return data;
      },
    },
  ],
  exports: [ImService],
})
export class ImModule {}
