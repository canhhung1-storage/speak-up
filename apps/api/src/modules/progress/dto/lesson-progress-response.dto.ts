import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProgressStatus } from '../../../database/entities/user-lesson-progress.entity';

export class LessonProgressResponseDto {
  @ApiProperty({ description: 'Lesson ID', example: 'd3b07384-d113-46d4-8d48-356c9e057367' })
  lessonId: string;

  @ApiProperty({ description: 'Lesson slug identifier', example: 'baseball-pig' })
  lessonSlug: string;

  @ApiProperty({ enum: ProgressStatus, example: ProgressStatus.COMPLETED })
  status: ProgressStatus;

  @ApiProperty({ description: 'Whether the lesson has been completed', example: true })
  isCompleted: boolean;

  @ApiPropertyOptional({ description: 'Last active audio track ID', example: 'main-story-article' })
  lastTrackId?: string;

  @ApiProperty({ description: 'Last played position in seconds', example: 45 })
  lastPlayedSeconds: number;

  @ApiProperty({
    description: 'Playback positions per track ID',
    example: { 'main-story-article': 45 },
  })
  playbackPositions: Record<string, number>;

  @ApiProperty({ description: 'Last accessed timestamp' })
  lastListenedAt: Date;

  @ApiPropertyOptional({ description: 'Completion timestamp if completed' })
  completedAt?: Date;
}
