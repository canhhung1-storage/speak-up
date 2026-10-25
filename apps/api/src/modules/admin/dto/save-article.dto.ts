import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class SaveArticleDto {
  @ApiProperty({
    description: 'Tiêu đề bài đọc chính',
    example: 'A Kiss - Main Story',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Nội dung bài đọc (hỗ trợ bôi đậm từ mới bằng thẻ <mark>word</mark>)',
    example: "Carlos buys a new car. It's a <mark>huge</mark>, blue, fast car...",
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'URL file âm thanh đọc bài viết chính',
    example: 'https://assets.speakup.internal/audio/a-kiss-article.mp3',
  })
  @IsString()
  @IsOptional()
  audioUrl?: string;

  @ApiPropertyOptional({
    description: 'Thời lượng file audio (tính bằng giây)',
    example: 154,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  durationSeconds?: number;
}
