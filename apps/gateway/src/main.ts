import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';
import { CustomExceptionFilter } from 'filters/custom-exception.filter';
import helmet from 'helmet';
import { FormatResponseInterceptor } from 'interceptors/format-response.interceptor';
import { InvokeRecordInterceptor } from 'interceptors/invoke-record.interceptor';
import { EtcdService } from '../../../libs/etcd/src/etcd.service';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule);

  app.use(helmet());
  // app.use(csurf());
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
  console.log(`localhost:${port}`);
  await app.listen(port);
}

bootstrap();
