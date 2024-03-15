import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import UniSMS from 'unisms';
import { SmsService } from './sms.service';

@Module({
  providers: [
    SmsService,
    {
      provide: 'SMS_CLIENT',
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const client = new UniSMS({
          accessKeyId: configService.get('unisms_access_key_id'),
          accessKeySecret: configService.get('unisms_access_key_secret'),
        });
        return client;
      },
    },
  ],
  exports: [SmsService],
})
export class SmsModule {}
