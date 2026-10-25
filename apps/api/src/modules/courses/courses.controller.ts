import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import {
  CourseResponseDto,
  CourseDetailResponseDto,
} from './dto/course-response.dto';

@ApiTags('Learner - Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả khóa học công khai đã xuất bản' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách khóa học',
    type: [CourseResponseDto],
  })
  async getCourses(): Promise<CourseResponseDto[]> {
    return this.coursesService.findAllPublished();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết khóa học theo slug kèm danh sách bài học' })
  @ApiParam({ name: 'slug', description: 'SEO slug khóa học (VD: power-english)' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết khóa học và danh sách bài học',
    type: CourseDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học' })
  async getCourseBySlug(
    @Param('slug') slug: string,
  ): Promise<CourseDetailResponseDto> {
    return this.coursesService.findBySlug(slug);
  }
}
