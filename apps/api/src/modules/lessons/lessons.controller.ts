import { Controller, Get, Param } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonDetailResponseDto } from './dto/lesson-detail-response.dto';

@Controller('courses/:courseSlug/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':lessonSlug')
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
