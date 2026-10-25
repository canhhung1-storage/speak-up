import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../../database/entities/course.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { AdminCourseResponseDto } from '../dto/admin-course-response.dto';

@Injectable()
export class AdminCoursesService {
  private readonly logger = new Logger(AdminCoursesService.name);

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  /**
   * Lấy toàn bộ danh sách khóa học (kể cả bản nháp) phục vụ quản trị
   */
  async findAll(): Promise<AdminCourseResponseDto[]> {
    this.logger.log('Fetching all courses for admin');

    const courses = await this.courseRepository.find({
      relations: ['lessons'],
      order: { orderIndex: 'ASC', createdAt: 'DESC' },
    });

    return courses.map((course) => this.mapToDto(course));
  }

  /**
   * Lấy chi tiết 1 khóa học theo ID
   */
  async findOne(id: string): Promise<AdminCourseResponseDto> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });

    if (!course) {
      throw new NotFoundException(`Khóa học với ID '${id}' không tồn tại`);
    }

    return this.mapToDto(course);
  }

  /**
   * Tạo mới khóa học
   */
  async create(dto: CreateCourseDto): Promise<AdminCourseResponseDto> {
    const slug = dto.slug || this.generateSlug(dto.title);

    // Kiểm tra trùng lặp slug
    const existing = await this.courseRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Đường dẫn slug '${slug}' đã được sử dụng`);
    }

    const course = this.courseRepository.create({
      ...dto,
      slug,
      orderIndex: dto.orderIndex ?? 0,
      isPublished: dto.isPublished ?? false,
    });

    const saved = await this.courseRepository.save(course);
    this.logger.log(`Created course: '${saved.title}' (${saved.id})`);

    return this.mapToDto(saved);
  }

  /**
   * Cập nhật thông tin khóa học
   */
  async update(id: string, dto: UpdateCourseDto): Promise<AdminCourseResponseDto> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });

    if (!course) {
      throw new NotFoundException(`Khóa học với ID '${id}' không tồn tại`);
    }

    if (dto.slug && dto.slug !== course.slug) {
      const existing = await this.courseRepository.findOne({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException(`Đường dẫn slug '${dto.slug}' đã tồn tại`);
      }
      course.slug = dto.slug;
    }

    if (dto.title !== undefined) course.title = dto.title;
    if (dto.description !== undefined) course.description = dto.description;
    if (dto.thumbnailUrl !== undefined) course.thumbnailUrl = dto.thumbnailUrl;
    if (dto.level !== undefined) course.level = dto.level;
    if (dto.isPublished !== undefined) course.isPublished = dto.isPublished;
    if (dto.orderIndex !== undefined) course.orderIndex = dto.orderIndex;

    const updated = await this.courseRepository.save(course);
    this.logger.log(`Updated course: '${updated.title}' (${updated.id})`);

    return this.mapToDto(updated);
  }

  /**
   * Bật/tắt nhanh trạng thái xuất bản (Publish / Draft toggle)
   */
  async togglePublish(id: string): Promise<AdminCourseResponseDto> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });

    if (!course) {
      throw new NotFoundException(`Khóa học với ID '${id}' không tồn tại`);
    }

    course.isPublished = !course.isPublished;
    const saved = await this.courseRepository.save(course);
    this.logger.log(
      `Course '${saved.title}' publish status toggled to: ${saved.isPublished}`,
    );

    return this.mapToDto(saved);
  }

  /**
   * Xóa khóa học
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Khóa học với ID '${id}' không tồn tại`);
    }

    await this.courseRepository.remove(course);
    this.logger.log(`Deleted course: '${course.title}' (${id})`);

    return { success: true, message: `Đã xóa thành công khóa học '${course.title}'` };
  }

  private mapToDto(course: Course): AdminCourseResponseDto {
    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      level: course.level,
      isPublished: course.isPublished,
      orderIndex: course.orderIndex,
      totalLessons: course.lessons?.length || 0,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
