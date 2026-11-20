import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LessonProgressResponseDto } from './lesson-progress-response.dto';

export class CourseProgressResponseDto {
  @ApiProperty({ description: 'Course ID', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  courseId: string;

  @ApiProperty({ description: 'Course slug identifier', example: 'flow-english' })
  courseSlug: string;

  @ApiProperty({ description: 'Total lessons count in the course', example: 12 })
  totalLessons: number;

  @ApiProperty({ description: 'Number of completed lessons', example: 4 })
  completedLessons: number;

  @ApiProperty({ description: 'Completion percentage (0 to 100)', example: 33 })
  progressPercent: number;

  @ApiPropertyOptional({
    description: 'Slug of the lesson last accessed by the learner',
    example: 'baseball-pig',
  })
  lastAccessedLessonSlug?: string;

  @ApiProperty({
    type: [LessonProgressResponseDto],
    description: 'Detailed progress for each lesson in the course',
  })
  lessons: LessonProgressResponseDto[];
}
