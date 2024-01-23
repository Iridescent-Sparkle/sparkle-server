import { NestFactory } from '@nestjs/core';
import { ConfigurationModule } from './configuration.module';

async function bootstrap() {
  const app = await NestFactory.create(ConfigurationModule);
  await app.listen(3000);
}
bootstrap();
