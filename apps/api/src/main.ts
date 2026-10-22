import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = parseInt(process.env.API_PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 [SpeakUp API] NestJS Server is running on: http://0.0.0.0:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('❌ Fatal error during NestJS bootstrap:', err);
});
