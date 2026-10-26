import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../database/entities/course.entity';
import {
  CourseResponseDto,
  CourseDetailResponseDto,
} from './dto/course-response.dto';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
   * Lấy chi tiết khóa học theo slug (hoặc UUID fallback) kèm danh sách bài học
   */
  async findBySlug(slugOrId: string): Promise<CourseDetailResponseDto> {
    this.logger.log(`Fetching course details for identifier: ${slugOrId}`);

    const isUuid = UUID_REGEX.test(slugOrId);
    const course = await this.courseRepository.findOne({
      where: isUuid
        ? { id: slugOrId, isPublished: true }
        : { slug: slugOrId, isPublished: true },
      relations: ['lessons'],
      order: {
        lessons: {
          orderIndex: 'ASC',
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course '${slugOrId}' not found`);
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
