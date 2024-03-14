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
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule);

  app.use(helmet());
  app.use(csurf());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  app.enableCors({ origin: [/\.iridescent.icu$/] });

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
