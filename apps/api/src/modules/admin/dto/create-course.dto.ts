import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  MaxLength,
  Matches,
} from 'class-validator';
import { CourseLevel } from '../../../database/entities/course.entity';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Tên hiển thị của khóa học',
    example: 'Power English Course',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Slug SEO duy nhất. Nếu để trống sẽ tự sinh từ title',
    example: 'power-english',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug phải là chữ thường không dấu, phân cách bằng dấu gạch ngang (kebab-case)',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Mô tả tổng quan về khóa học, phương pháp và mục tiêu',
    example: 'Khóa học tiếng Anh giao tiếp phản xạ tự nhiên theo phương pháp Effortless English của thầy AJ Hoge.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn ảnh bìa của khóa học',
    example: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600',
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Cấp độ học viên phù hợp',
    enum: CourseLevel,
    default: CourseLevel.INTERMEDIATE,
  })
  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel = CourseLevel.INTERMEDIATE;

  @ApiPropertyOptional({
    description: 'Trạng thái xuất bản (true: Công khai, false: Bản nháp)',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = false;

  @ApiPropertyOptional({
    description: 'Thứ tự ưu tiên sắp xếp hiển thị',
    default: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number = 0;
}
