import { ApiProperty } from '@nestjs/swagger';
import { ProgressStatus } from '../../../database/entities/user-lesson-progress.entity';

export class LessonStudyTimeItemDto {
  @ApiProperty({ description: 'Lesson UUID', example: 'd3b07384-d113-46d4-8d48-356c9e057367' })
  lessonId: string;

  @ApiProperty({ description: 'Lesson Title', example: 'A Kiss' })
  lessonTitle: string;

  @ApiProperty({ description: 'Lesson Slug', example: 'a-kiss' })
  lessonSlug: string;

  @ApiProperty({ description: 'Course Title', example: 'Power English' })
  courseTitle: string;

  @ApiProperty({ description: 'Course Slug', example: 'power-english' })
  courseSlug: string;

  @ApiProperty({ description: 'Total minutes spent learning this lesson', example: 45 })
  totalMinutesSpent: number;

  @ApiProperty({ enum: ProgressStatus, example: ProgressStatus.COMPLETED })
  status: ProgressStatus;

  @ApiProperty({ description: 'Last listened timestamp' })
  lastListenedAt: Date;
}
