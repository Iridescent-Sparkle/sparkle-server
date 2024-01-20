import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './lib/interceptors/format-response.interceptor';
import { InvokeRecordInterceptor } from './lib/interceptors/invoke-record.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  const config = new DocumentBuilder()
    .setTitle('sparkle-server')
    .setDescription('接口文档')
    .setVersion('1.0')
    .addTag('test')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('nest_server_port');
  await app.listen(port);
}
bootstrap();
