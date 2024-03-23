import { INestApplication, Inject, Injectable } from '@nestjs/common';
import { Etcd3 } from 'etcd3';

@Injectable()
export class EtcdService {
  @Inject('ETCD_CLIENT')
  private client: Etcd3;

  /** 保存配置 */
  async saveConfig(key, value) {
    await this.client.put(key).value(value);
  }

  /** 读取配置 */
  async getConfig(key) {
    return await this.client.get(key).string();
  }

  /** 删除配置 */
  async deleteConfig(key: string) {
    await this.client.delete().key(key);
  }

  /** 监听配置 */
  async watchConfig(key: string, callback: (params?: any) => any) {
    const watcher = await this.client.watch().prefix(key).create();
    watcher.on('data', async () => {
      callback && callback();
    });
    return watcher;
  }

  /**监听配置并重启服务 */
  async watchConfigAndRestart(
    app: INestApplication,
    callback: (params?: any) => any,
  ) {
    const watcher = await this.client.watch().prefix('/config').create();
    watcher.on('data', async () => {
      await app.close();
      await watcher.removeAllListeners();
      callback && callback();
    });
  }
  /** 服务注册 */
  async registerService(
    serviceName: string,
    instanceId: string,
    metadata: Record<string, any>,
  ) {
    const key = `/services/${serviceName}/${instanceId}`;
    const lease = this.client.lease(10);
    await lease.put(key).value(JSON.stringify(metadata));
    lease.on('lost', async () => {
      console.log('租约过期，重新注册...');
      await this.registerService(serviceName, instanceId, metadata);
    });
  }

  /** 服务发现 */
  async discoverService(serviceName: string) {
    const instances = await this.client
      .getAll()
      .prefix(`/services/${serviceName}`)
      .strings();
    return Object.entries(instances).map(([, value]) => JSON.parse(value));
  }

  /** 监听服务变更 */
  async watchService(serviceName: string, callback: (params?: any) => any) {
    const watcher = await this.client
      .watch()
      .prefix(`/services/${serviceName}`)
      .create();
    watcher
      .on('put', async (event) => {
        console.log('新的服务节点添加:', event.key.toString());
        callback(await this.discoverService(serviceName));
      })
      .on('delete', async (event) => {
        console.log('服务节点删除:', event.key.toString());
        callback(await this.discoverService(serviceName));
      });
  }
}
