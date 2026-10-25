import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { LessonDetailResponseDto } from './dto/lesson-detail-response.dto';

@ApiTags('Learner - Courses')
@Controller('courses/:courseSlug/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':lessonSlug')
  @ApiOperation({
    summary:
      'Lấy chi tiết bài học dành cho phòng học Effortless Studio (kèm bài đọc, từ vựng, audios)',
  })
  @ApiParam({ name: 'courseSlug', description: 'SEO slug khóa học' })
  @ApiParam({ name: 'lessonSlug', description: 'SEO slug bài học' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết bài học đầy đủ',
    type: LessonDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học trong khóa học' })
  async getLessonDetail(
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
  ): Promise<LessonDetailResponseDto> {
    return this.lessonsService.findByCourseAndLessonSlug(
      courseSlug,
      lessonSlug,
    );
  }
}
