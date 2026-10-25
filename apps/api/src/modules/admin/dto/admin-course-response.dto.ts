import { ApiProperty } from '@nestjs/swagger';
import { CourseLevel } from '../../../database/entities/course.entity';

export class AdminCourseResponseDto {
  @ApiProperty({ example: 'aea4b5ef-8064-4d11-9a7a-44be46b08d89' })
  id: string;

  @ApiProperty({ example: 'Power English' })
  title: string;

  @ApiProperty({ example: 'power-english' })
  slug: string;

  @ApiProperty({ example: 'Khóa học tiếng Anh giao tiếp...' })
  description: string;

  @ApiProperty({ example: 'https://images.unsplash.com/...' })
  thumbnailUrl: string;

  @ApiProperty({ enum: CourseLevel, example: CourseLevel.INTERMEDIATE })
  level: CourseLevel;

  @ApiProperty({ example: true })
  isPublished: boolean;

  @ApiProperty({ example: 1 })
  orderIndex: number;

  @ApiProperty({ example: 12, description: 'Tổng số bài học thuộc khóa này' })
  totalLessons: number;

  @ApiProperty({ example: '2026-10-22T07:28:29.401Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-25T14:00:00.000Z' })
  updatedAt: Date;
}
