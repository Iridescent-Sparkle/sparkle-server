import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ImService {
  private logger = new Logger();

  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject('IM_CLIENT')
  private readonly imClient: {
    application: string;
    access_token: string;
    expires_in: number;
  };

  async register({
    username,
    roleType,
  }: {
    username: string;
    roleType: 'B' | 'C';
  }) {
    const data = await firstValueFrom(
      this.httpService.post(
        `https://${this.configService.get('im_host')}/${this.configService.get(
          'im_org_name',
        )}/${this.configService.get('im_app_name')}/users`,
        {
          username: username + '_sparkle' + `_${roleType}`,
          password: username + '_password',
        },
        {
          headers: {
            Authorization: `Bearer ${this.imClient.access_token}`,
          },
        },
      ),
    );
    this.logger.log(data);
  }
}
