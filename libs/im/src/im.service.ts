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
    roleType: 'b' | 'c';
  }) {
    return await firstValueFrom(
      this.httpService.post(
        `https://${this.configService.get('im_host')}/${this.configService.get(
          'im_org_name',
        )}/${this.configService.get('im_app_name')}/users`,
        {
          username: username + '_sparkle_' + `${roleType}`,
          password: username + '_password',
        },
        {
          headers: {
            Authorization: `Bearer ${this.imClient.access_token}`,
          },
        },
      ),
    );
  }

  async updateUser({
    username,
    roleType,
    nickname,
    avatarurl,
    phone,
    mail,
  }: {
    username: string;
    nickname: string;
    avatarurl: string;
    phone: string;
    mail: string;
    roleType: 'b' | 'c';
  }) {
    this.logger.error(username + '_sparkle_' + roleType);
    return await firstValueFrom(
      this.httpService.put(
        `https://${this.configService.get('im_host')}/${this.configService.get(
          'im_org_name',
        )}/${this.configService.get('im_app_name')}/metadata/user/${
          username + '_sparkle_' + roleType
        }`,
        {
          nickname,
          avatarurl,
          phone,
          mail,
        },
        {
          headers: {
            Authorization: `Bearer ${this.imClient.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );
  }

  async findUser({
    username,
    roleType,
  }: {
    username: string;
    roleType: 'b' | 'c';
  }) {
    return await firstValueFrom(
      this.httpService.get(
        `https://${this.configService.get('im_host')}/${this.configService.get(
          'im_org_name',
        )}/${this.configService.get('im_app_name')}/metadata/user/${
          username + '_sparkle_' + roleType
        }`,
        {
          headers: {
            Authorization: `Bearer ${this.imClient.access_token}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );
  }

  async findAllUser({ userIds }: { userIds: string[] }) {
    return await firstValueFrom(
      this.httpService.post(
        `https://${this.configService.get('im_host')}/${this.configService.get(
          'im_org_name',
        )}/${this.configService.get('im_app_name')}/metadata/user/get`,
        {
          targets: userIds,
          properties: ['avatarurl', 'ext', 'nickname', 'phone', 'mail'],
        },
        {
          headers: {
            Authorization: `Bearer ${this.imClient.access_token}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );
  }
}
