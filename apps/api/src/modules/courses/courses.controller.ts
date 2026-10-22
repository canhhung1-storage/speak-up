import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CourseResponseDto,
  CourseDetailResponseDto,
} from './dto/course-response.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getCourses(): Promise<CourseResponseDto[]> {
    return this.coursesService.findAllPublished();
  }

  @Get(':slug')
  async getCourseBySlug(
    @Param('slug') slug: string,
  ): Promise<CourseDetailResponseDto> {
    return this.coursesService.findBySlug(slug);
  }
}
