import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsUUID } from 'class-validator';

export class SaveVocabularyDto {
  @ApiPropertyOptional({
    description: 'ID từ vựng (nếu đang chỉnh sửa từ có sẵn)',
    example: '2a70acf9-ffe6-49da-b98d-1fbf2f8b9db9',
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Từ vựng tiếng Anh',
    example: 'huge',
  })
  @IsString()
  @IsNotEmpty()
  word: string;

  @ApiPropertyOptional({
    description: 'Phiên âm quốc tế IPA',
    example: '/hjuːdʒ/',
  })
  @IsString()
  @IsOptional()
  ipa?: string;

  @ApiProperty({
    description: 'Nghĩa tiếng Việt',
    example: 'Khổng lồ, to lớn',
  })
  @IsString()
  @IsNotEmpty()
  meaningVi: string;

  @ApiPropertyOptional({
    description: 'Định nghĩa tiếng Anh đơn giản theo phong cách Effortless English',
    example: 'Extremely large; enormous',
  })
  @IsString()
  @IsOptional()
  definitionEn?: string;

  @ApiPropertyOptional({
    description: 'Câu ví dụ chứa từ mới',
    example: "It's a huge, blue, fast car.",
  })
  @IsString()
  @IsOptional()
  exampleSentence?: string;

  @ApiPropertyOptional({
    description: 'Audio phát âm riêng của từ',
    example: 'https://assets.speakup.internal/audio/vocab/huge.mp3',
  })
  @IsString()
  @IsOptional()
  audioUrl?: string;

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp từ vựng',
    default: 1,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number = 1;
}
