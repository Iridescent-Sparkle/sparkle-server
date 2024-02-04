import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from 'interceptors/format-response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { InvokeRecordInterceptor } from 'interceptors/invoke-record.interceptor';
import { EtcdService } from '../../../libs/etcd/src/etcd.service';
import { CustomExceptionFilter } from 'filters/custom-exception.filter';
import helmet from 'helmet';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.use(helmet());
  app.use(csurf());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  const configService: ConfigService = app.get(ConfigService);
  const etcdService: EtcdService = app.get(EtcdService);
  await etcdService.watchConfigAndRestart(app, bootstrap);
  const port = configService.get('nest_server_port');
  await app.listen(port);
}

bootstrap();
