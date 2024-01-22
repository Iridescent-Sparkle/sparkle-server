import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from 'interceptors/format-response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { InvokeRecordInterceptor } from 'interceptors/invoke-record.interceptor';
import { EtcdService } from '../../../libs/etcd/src/etcd.service';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  const configService: ConfigService = app.get(ConfigService);
  const etcdService: EtcdService = app.get(EtcdService);
  const watcher = await etcdService.watchConfig('/config', async () => {
    await app.close();
    await watcher.removeAllListeners();
    bootstrap();
  });
  const port = configService.get('nest_server_port');
  await app.listen(port);
}

bootstrap();
