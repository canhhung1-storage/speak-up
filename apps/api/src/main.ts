import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Trust first reverse proxy (Nginx Gateway) so req.ip and rate-limiting identify real client IPs
  const expressApp = app.getHttpAdapter().getInstance();
  if (typeof expressApp?.set === 'function') {
    expressApp.set('trust proxy', 1);
  }

  // 1. Security Headers via Helmet (relaxed CSP for Swagger UI)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Support cross-origin audio/static media
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Support Google GIS popup
      contentSecurityPolicy: false, // Cho phép Swagger UI tải CSS/JS trực quan
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

  // 6. Swagger / OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SpeakUp API Documentation')
    .setDescription(
      'Hệ thống REST API cho Nền tảng luyện phản xạ Effortless English SpeakUp (Web & Mobile App)',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Nhập Access Token (JWT)',
        in: 'header',
      },
      'bearer',
    )
    .addCookieAuth('refreshToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refreshToken',
      description: 'HttpOnly Refresh Token Cookie (dành cho Web)',
    })
    .addTag('Health', 'Kiểm tra trạng thái hoạt động của hệ thống')
    .addTag('Auth', 'Xác thực Google OAuth 2.0, cấp phát & xoay vòng Refresh Token')
    .addTag('Learner - Courses', 'Danh sách khóa học và bài học công khai dành cho học viên')
    .addTag('Admin - Courses', 'Quản trị viên CRUD danh mục khóa học')
    .addTag('Admin - Lessons & Studio', 'Quản trị viên soạn thảo bài học, bài đọc, từ vựng và audio phản xạ')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    customSiteTitle: 'SpeakUp API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = parseInt(process.env.API_PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 [SpeakUp API] NestJS Server is running on: http://0.0.0.0:${port}/api`);
  logger.log(`📚 [Swagger Docs] Interactive API Documentation available at: http://0.0.0.0:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('❌ Fatal error during NestJS bootstrap:', err);
});
