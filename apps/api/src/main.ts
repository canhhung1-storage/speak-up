import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Support cross-origin audio/static media
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Support Google GIS popup
    }),
  );

  // 2. Cookie parser for HttpOnly session cookies
  app.use(cookieParser());

  // 3. Global API prefix
  app.setGlobalPrefix('api');

  // 4. CORS Whitelisting
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : [
        'http://localhost:8080',
        'http://localhost:4200',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:4200',
      ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, server-to-server, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS rejected for origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  });

  // 5. Global exception filter & input validation
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
