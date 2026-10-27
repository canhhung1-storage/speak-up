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
    description: 'Từ / cụm từ tiếng Anh',
    example: 'a raise',
  })
  @IsString()
  @IsNotEmpty()
  word: string;

  @ApiPropertyOptional({
    description: 'Định nghĩa tiếng Anh đơn giản theo phong cách Effortless English',
    example: 'a pay increase, an increase in money for a job',
  })
  @IsString()
  @IsOptional()
  definitionEn?: string;

  @ApiPropertyOptional({
    description: 'Câu ví dụ chứa từ mới trong ngữ cảnh',
    example: 'She asked her boss for a raise.',
  })
  @IsString()
  @IsOptional()
  exampleSentence?: string;

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp từ vựng',
    default: 1,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number = 1;
}
