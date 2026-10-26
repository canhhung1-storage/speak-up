import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class ReorderLessonsDto {
  @ApiProperty({
    description: 'Mảng danh sách UUID các bài học theo thứ tự sắp xếp mới',
    example: [
      'afb38d9f-84e5-441e-81fe-b7268fa59747',
      'c4748750-2455-450f-925e-f6b3334667c2',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  lessonIds: string[];
}
