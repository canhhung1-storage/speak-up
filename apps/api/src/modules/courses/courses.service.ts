import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../database/entities/course.entity';
import {
  CourseResponseDto,
  CourseDetailResponseDto,
} from './dto/course-response.dto';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  /**
   * Lấy danh sách toàn bộ khóa học đã xuất bản (isPublished = true)
   */
  async findAllPublished(): Promise<CourseResponseDto[]> {
    this.logger.log('Fetching all published courses');

    const courses = await this.courseRepository.find({
      where: { isPublished: true },
      relations: ['lessons'],
      order: { orderIndex: 'ASC' },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      level: course.level,
      orderIndex: course.orderIndex,
      totalLessons: course.lessons?.length || 0,
      createdAt: course.createdAt,
    }));
  }

  /**
   * Lấy chi tiết khóa học theo slug kèm danh sách bài học
   */
  async findBySlug(slug: string): Promise<CourseDetailResponseDto> {
    this.logger.log(`Fetching course details for slug: ${slug}`);

    const course = await this.courseRepository.findOne({
      where: { slug, isPublished: true },
      relations: ['lessons'],
      order: {
        lessons: {
          orderIndex: 'ASC',
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug '${slug}' not found`);
    }

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      level: course.level,
      orderIndex: course.orderIndex,
      totalLessons: course.lessons?.length || 0,
      createdAt: course.createdAt,
      lessons: (course.lessons || []).map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        orderIndex: lesson.orderIndex,
        description: lesson.description,
      })),
    };
  }
}
