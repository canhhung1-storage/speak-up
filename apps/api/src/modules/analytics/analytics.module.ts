import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLessonProgress } from '../../database/entities/user-lesson-progress.entity';
import { UserDailyStudyLog } from '../../database/entities/user-daily-study-log.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserLessonProgress, UserDailyStudyLog])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
