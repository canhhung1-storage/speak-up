import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
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

export class CreateLessonDto {
  @ApiProperty({
    description: 'Tên bài học',
    example: 'A Kiss',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Slug bài học. Nếu để trống sẽ tự tạo từ title',
    example: 'a-kiss',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug bài học phải là chữ thường không dấu, phân cách bằng dấu gạch ngang',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Mô tả tóm tắt nội dung bài học',
    example: 'Bài học mở đầu kinh điển kể về câu chuyện Carlos mua xe mới và gặp một cô gái xinh đẹp trên đường.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn bài giảng audio giải thích từ vựng tổng quan',
    example: 'https://assets.speakup.internal/audio/a-kiss-vocab.mp3',
  })
  @IsString()
  @IsOptional()
  vocabAudioUrl?: string;

  @ApiPropertyOptional({
    description: 'Thứ tự bài học trong khóa',
    default: 1,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number = 1;

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
