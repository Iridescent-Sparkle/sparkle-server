import Client, * as Sts20150401 from '@alicloud/sts20150401';
import * as Util from '@alicloud/tea-util';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class OssService {
  @Inject('OSS_SERVICE')
  private readonly ossClient: Client;

  async getSTSToken() {
    const assumeRoleRequest = new Sts20150401.AssumeRoleRequest({
      roleArn: 'acs:ram::1285671690456705:role/aliyunossfullroleaccess',
      roleSessionName: 'oss',
    });
    const runtime = new Util.RuntimeOptions({});
    try {
      const res = await this.ossClient.assumeRoleWithOptions(
        assumeRoleRequest,
        runtime,
      );

      return res.body.credentials;
    } catch (error) {
      console.log(error.message);
      console.log(error.data['Recommend']);
    }
  }
}
