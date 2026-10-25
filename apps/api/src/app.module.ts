import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { RedisModule } from './common/redis/redis.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import {
  User,
  Course,
  Lesson,
  LessonArticle,
  LessonVocabulary,
  LessonAudio,
  UserLessonProgress,
} from './database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute globally
      },
    ]),
    RedisModule,
    AuthModule,
    CoursesModule,
    LessonsModule,
    AdminModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST') || 'postgres',
        port: parseInt(configService.get<string>('POSTGRES_PORT') || '5432', 10),
        username: configService.get<string>('POSTGRES_USER') || 'speakup_user',
        password: configService.get<string>('POSTGRES_PASSWORD') || 'speakup_secret_pass',
        database: configService.get<string>('POSTGRES_DB') || 'speakup_db',
        entities: [
          User,
          Course,
          Lesson,
          LessonArticle,
          LessonVocabulary,
          LessonAudio,
          UserLessonProgress,
        ],
        // Chỉ tự động đồng bộ schema trong môi trường development, cấm chạy trên production tránh mất mát dữ liệu
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
