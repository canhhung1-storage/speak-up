import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';
import { AudioType } from '../../../database/entities/lesson-audio.entity';

export class SaveAudioDto {
  @ApiPropertyOptional({
    description: 'ID file audio (nếu chỉnh sửa file có sẵn)',
    example: '42b17e26-ed46-4127-b78e-587e3600f721',
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Loại bài nghe Effortless English',
    enum: AudioType,
    example: AudioType.MINI_STORY,
  })
  @IsEnum(AudioType)
  @IsNotEmpty()
  audioType: AudioType;

  @ApiProperty({
    description: 'Tên hiển thị bài nghe',
    example: 'A Kiss - Mini Story A',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Đường dẫn file âm thanh',
    example: 'https://assets.speakup.internal/audio/a-kiss-mini-story-a.mp3',
  })
  @IsString()
  @IsNotEmpty()
  audioUrl: string;

  @ApiPropertyOptional({
    description: 'Lời thoại (Transcript) đầy đủ của bài nghe',
    example: 'Carlos bought a new car. Did Carlos buy a new car? Yes, he did...',
  })
  @IsString()
  @IsOptional()
  transcript?: string;

  @ApiPropertyOptional({
    description: 'Thời lượng file audio (giây)',
    example: 620,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  durationSeconds?: number;

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp audio',
    default: 1,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number = 1;
}
