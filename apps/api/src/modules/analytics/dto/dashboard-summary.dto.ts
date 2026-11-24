import { ApiProperty } from '@nestjs/swagger';
import { DailyActivityItemDto } from './daily-activity-item.dto';

export class DashboardSummaryDto {
  @ApiProperty({ description: 'Total study time across all lessons in minutes', example: 245 })
  totalStudyMinutes: number;

  @ApiProperty({ description: 'Minutes spent studying today', example: 22 })
  todayStudyMinutes: number;

  @ApiProperty({ description: 'Daily study goal in minutes', example: 30 })
  dailyGoalMinutes: number;

  @ApiProperty({ description: 'Percentage towards today goal (0 to 100+)', example: 73 })
  goalProgressPercent: number;

  @ApiProperty({ description: 'Consecutive active study days streak', example: 5 })
  currentStreak: number;

  @ApiProperty({ description: 'Total number of completed lessons', example: 6 })
  completedLessonsCount: number;

  @ApiProperty({ description: 'Total number of in-progress lessons', example: 3 })
  inProgressLessonsCount: number;

  @ApiProperty({
    type: [DailyActivityItemDto],
    description: 'Weekly activity breakdown for the last 7 days',
  })
  weeklyActivity: DailyActivityItemDto[];
}
