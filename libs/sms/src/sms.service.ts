import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import UniSMS from 'unisms';

@Injectable()
export class SmsService {
  @Inject('SMS_CLIENT')
  private readonly smsClient: UniSMS;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async sendSms({ phone, code }: { phone: string; code: string }) {
    await this.smsClient.send({
      to: phone,
      signature: this.configService.get('unisms_signature'),
      templateId: this.configService.get('unisms_template_id'),
      templateData: {
        code,
        ttl: 5,
      },
    });
  }
}
