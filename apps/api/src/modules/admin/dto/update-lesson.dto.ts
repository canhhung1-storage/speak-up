import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  Matches,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SaveArticleDto } from './save-article.dto';
import { SaveVocabularyDto } from './save-vocabulary.dto';
import { SaveAudioDto } from './save-audio.dto';

export class UpdateLessonDto {
  @ApiPropertyOptional({ example: 'A Kiss' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'a-kiss' })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ example: 'Mô tả bài học...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://assets.speakup.internal/audio/a-kiss-vocab.mp3' })
  @IsString()
  @IsOptional()
  vocabAudioUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;

  @ApiPropertyOptional({ type: SaveArticleDto, description: 'Nội dung bài đọc chính' })
  @ValidateNested()
  @Type(() => SaveArticleDto)
  @IsOptional()
  article?: SaveArticleDto;

  @ApiPropertyOptional({ type: [SaveVocabularyDto], description: 'Danh sách từ vựng' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveVocabularyDto)
  @IsOptional()
  vocabularies?: SaveVocabularyDto[];

  @ApiPropertyOptional({ type: [SaveAudioDto], description: 'Danh sách các bài nghe' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveAudioDto)
  @IsOptional()
  audios?: SaveAudioDto[];
}
