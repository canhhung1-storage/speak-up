import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsObject,
  Min,
} from 'class-validator';
import { ProgressStatus } from '../../../database/entities/user-lesson-progress.entity';

export class UpdateProgressDto {
  @ApiPropertyOptional({
    enum: ProgressStatus,
    description: 'Learning status of the lesson',
    example: ProgressStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(ProgressStatus)
  status?: ProgressStatus;

  @ApiPropertyOptional({
    description: 'ID of the active audio track being played',
    example: 'main-story-article',
  })
  @IsOptional()
  @IsString()
  lastTrackId?: string;

  @ApiPropertyOptional({
    description: 'Current playback position in seconds',
    example: 45,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lastPlayedSeconds?: number;

  @ApiPropertyOptional({
    description: 'Granular playback positions mapped per audio track ID',
    example: { 'main-story-article': 45, 'track-1': 120 },
  })
  @IsOptional()
  @IsObject()
  playbackPositions?: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Convenience flag to mark lesson as completed or in progress',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({
    description: 'Incremental active study time in seconds during this session',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  timeSpentDeltaSeconds?: number;
}
