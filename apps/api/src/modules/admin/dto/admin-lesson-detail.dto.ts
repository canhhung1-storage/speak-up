import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AudioType } from '../../../database/entities/lesson-audio.entity';

export class AdminArticleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  audioUrl?: string;

  @ApiPropertyOptional()
  durationSeconds?: number;
}

export class AdminVocabularyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  word: string;

  @ApiPropertyOptional()
  ipa?: string;

  @ApiProperty()
  meaningVi: string;

  @ApiPropertyOptional()
  definitionEn?: string;

  @ApiPropertyOptional()
  exampleSentence?: string;

  @ApiPropertyOptional()
  audioUrl?: string;

  @ApiProperty()
  orderIndex: number;
}

export class AdminAudioResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: AudioType })
  audioType: AudioType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  audioUrl: string;

  @ApiPropertyOptional()
  transcript?: string;

  @ApiPropertyOptional()
  durationSeconds?: number;

  @ApiProperty()
  orderIndex: number;
}

export class AdminLessonSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  courseId: string;

  @ApiPropertyOptional()
  courseSlug?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  vocabAudioUrl?: string;

  @ApiProperty()
  orderIndex: number;

  @ApiProperty({ description: 'Bài học đã có bài đọc hay chưa' })
  hasArticle: boolean;

  @ApiProperty({ description: 'Số lượng từ vựng trong bài' })
  totalVocabularies: number;

  @ApiProperty({ description: 'Số lượng track âm thanh trong bài' })
  totalAudios: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AdminLessonDetailDto extends AdminLessonSummaryDto {
  @ApiPropertyOptional({ type: AdminArticleResponseDto })
  article?: AdminArticleResponseDto;

  @ApiProperty({ type: [AdminVocabularyResponseDto] })
  vocabularies: AdminVocabularyResponseDto[];

  @ApiProperty({ type: [AdminAudioResponseDto] })
  audios: AdminAudioResponseDto[];
}
