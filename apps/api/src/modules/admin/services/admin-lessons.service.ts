import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Lesson } from '../../../database/entities/lesson.entity';
import { Course } from '../../../database/entities/course.entity';
import { LessonArticle } from '../../../database/entities/lesson-article.entity';
import { LessonVocabulary } from '../../../database/entities/lesson-vocabulary.entity';
import { LessonAudio } from '../../../database/entities/lesson-audio.entity';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import {
  AdminLessonSummaryDto,
  AdminLessonDetailDto,
} from '../dto/admin-lesson-detail.dto';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class AdminLessonsService {
  private readonly logger = new Logger(AdminLessonsService.name);

  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly dataSource: DataSource,
  ) {}

  private isUUID(value: string): boolean {
    return UUID_REGEX.test(value);
  }

  /**
   * Helper tìm kiếm Course theo UUID hoặc SEO Slug
   */
  async findCourseEntity(courseIdOrSlug: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: this.isUUID(courseIdOrSlug)
        ? { id: courseIdOrSlug }
        : { slug: courseIdOrSlug },
    });

    if (!course) {
      throw new NotFoundException(
        `Khóa học với định danh '${courseIdOrSlug}' không tồn tại`,
      );
    }

    return course;
  }

  /**
   * Helper tìm kiếm Lesson theo UUID hoặc SEO Slug (có thể kèm courseIdOrSlug)
   */
  async findLessonEntity(
    idOrSlug: string,
    courseIdOrSlug?: string,
  ): Promise<Lesson> {
    let course: Course | null = null;
    if (courseIdOrSlug) {
      course = await this.findCourseEntity(courseIdOrSlug);
    }

    let lesson: Lesson | null = null;

    if (this.isUUID(idOrSlug)) {
      lesson = await this.lessonRepository.findOne({
        where: course
          ? { id: idOrSlug, course: { id: course.id } }
          : { id: idOrSlug },
        relations: ['course', 'article', 'vocabularies', 'audios'],
        order: {
          vocabularies: { orderIndex: 'ASC' },
          audios: { orderIndex: 'ASC' },
        },
      });
    } else {
      lesson = await this.lessonRepository.findOne({
        where: course
          ? { slug: idOrSlug, course: { id: course.id } }
          : { slug: idOrSlug },
        relations: ['course', 'article', 'vocabularies', 'audios'],
        order: {
          vocabularies: { orderIndex: 'ASC' },
          audios: { orderIndex: 'ASC' },
        },
      });
    }

    if (!lesson) {
      throw new NotFoundException(
        `Bài học với định danh '${idOrSlug}' không tồn tại`,
      );
    }

    return lesson;
  }

  /**
   * Lấy danh sách tóm tắt tất cả bài học trong một khóa học (theo UUID hoặc Slug)
   */
  async findByCourse(courseIdOrSlug: string): Promise<AdminLessonSummaryDto[]> {
    const course = await this.findCourseEntity(courseIdOrSlug);

    const lessons = await this.lessonRepository.find({
      where: { course: { id: course.id } },
      relations: ['article', 'vocabularies', 'audios'],
      order: { orderIndex: 'ASC', createdAt: 'ASC' },
    });

    return lessons.map((lesson) => ({
      id: lesson.id,
      courseId: course.id,
      courseSlug: course.slug,
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      orderIndex: lesson.orderIndex,
      hasArticle: !!lesson.article,
      totalVocabularies: lesson.vocabularies?.length || 0,
      totalAudios: lesson.audios?.length || 0,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    }));
  }

  /**
   * Lấy chi tiết toàn diện một bài học (kèm Article, Vocabularies, Audios)
   */
  async findOne(
    idOrSlug: string,
    courseIdOrSlug?: string,
  ): Promise<AdminLessonDetailDto> {
    const lesson = await this.findLessonEntity(idOrSlug, courseIdOrSlug);

    return {
      id: lesson.id,
      courseId: lesson.course?.id || '',
      courseSlug: lesson.course?.slug || '',
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      orderIndex: lesson.orderIndex,
      hasArticle: !!lesson.article,
      totalVocabularies: lesson.vocabularies?.length || 0,
      totalAudios: lesson.audios?.length || 0,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      article: lesson.article
        ? {
            id: lesson.article.id,
            title: lesson.article.title,
            content: lesson.article.content,
            audioUrl: lesson.article.audioUrl,
            durationSeconds: lesson.article.durationSeconds,
          }
        : undefined,
      vocabularies: (lesson.vocabularies || []).map((v) => ({
        id: v.id,
        word: v.word,
        definitionEn: v.definitionEn,
        exampleSentence: v.exampleSentence,
        orderIndex: v.orderIndex,
      })),
      audios: (lesson.audios || []).map((a) => ({
        id: a.id,
        audioType: a.audioType,
        title: a.title,
        audioUrl: a.audioUrl,
        transcript: a.transcript,
        durationSeconds: a.durationSeconds,
        orderIndex: a.orderIndex,
      })),
    };
  }

  /**
   * Tạo bài học mới trong khóa học (kèm Article, Vocabularies và Audios)
   */
  async create(
    courseIdOrSlug: string,
    dto: CreateLessonDto,
  ): Promise<AdminLessonDetailDto> {
    const course = await this.findCourseEntity(courseIdOrSlug);
    const slug = dto.slug || this.generateSlug(dto.title);

    // Kiểm tra trùng lặp slug trong cùng một khóa học
    const existing = await this.lessonRepository.findOne({
      where: { slug, course: { id: course.id } },
    });
    if (existing) {
      throw new ConflictException(
        `Bài học với slug '${slug}' đã tồn tại trong khóa học này`,
      );
    }

    const savedId = await this.dataSource.transaction(async (manager) => {
      const lesson = manager.create(Lesson, {
        title: dto.title,
        slug,
        description: dto.description,
        orderIndex: dto.orderIndex ?? 1,
        course,
      });

      const saved = await manager.save(Lesson, lesson);

      // Article
      if (dto.article && dto.article.title) {
        const article = manager.create(LessonArticle, {
          title: dto.article.title,
          content: dto.article.content || '',
          audioUrl: dto.article.audioUrl || '',
          durationSeconds: dto.article.durationSeconds || 0,
          lesson: saved,
        });
        await manager.save(LessonArticle, article);
      }

      // Vocabularies
      if (dto.vocabularies && dto.vocabularies.length > 0) {
        const vocabEntities = dto.vocabularies.map((v, idx) =>
          manager.create(LessonVocabulary, {
            word: v.word,
            definitionEn: v.definitionEn || '',
            exampleSentence: v.exampleSentence || '',
            orderIndex: v.orderIndex ?? idx + 1,
            lesson: saved,
          }),
        );
        await manager.save(LessonVocabulary, vocabEntities);
      }

      // Audios
      if (dto.audios && dto.audios.length > 0) {
        const audioEntities = dto.audios.map((a, idx) =>
          manager.create(LessonAudio, {
            audioType: a.audioType,
            title: a.title,
            audioUrl: a.audioUrl,
            transcript: a.transcript || '',
            durationSeconds: a.durationSeconds || 0,
            orderIndex: a.orderIndex ?? idx + 1,
            lesson: saved,
          }),
        );
        await manager.save(LessonAudio, audioEntities);
      }

      return saved.id;
    });

    this.logger.log(
      `Created lesson '${dto.title}' (${savedId}) in course '${course.title}'`,
    );
    return this.findOne(savedId);
  }

  /**
   * Cập nhật toàn diện bài học (Transactional Save cho Article, Vocabularies và Audios)
   */
  async update(
    idOrSlug: string,
    dto: UpdateLessonDto,
    courseIdOrSlug?: string,
  ): Promise<AdminLessonDetailDto> {
    const lesson = await this.findLessonEntity(idOrSlug, courseIdOrSlug);
    const lessonId = lesson.id;

    // Thực hiện trong TypeORM Transaction
    await this.dataSource.transaction(async (manager) => {
      // 1. Cập nhật thông tin cơ bản của Lesson
      if (dto.title !== undefined) lesson.title = dto.title;
      if (dto.slug !== undefined && dto.slug !== lesson.slug) {
        const existing = await manager.findOne(Lesson, {
          where: { slug: dto.slug, course: { id: lesson.course.id } },
        });
        if (existing && existing.id !== lessonId) {
          throw new ConflictException(
            `Slug '${dto.slug}' đã tồn tại trong khóa học này`,
          );
        }
        lesson.slug = dto.slug;
      }
      if (dto.description !== undefined) lesson.description = dto.description;
      if (dto.orderIndex !== undefined) lesson.orderIndex = dto.orderIndex;

      await manager.save(Lesson, lesson);

      // 2. Cập nhật Article (1:1)
      if (dto.article !== undefined) {
        let article = await manager.findOne(LessonArticle, {
          where: { lesson: { id: lessonId } },
        });

        if (article) {
          article.title = dto.article.title;
          article.content = dto.article.content !== undefined ? dto.article.content : (article.content || '');
          article.audioUrl = dto.article.audioUrl || '';
          article.durationSeconds = dto.article.durationSeconds || 0;
          await manager.save(LessonArticle, article);
        } else {
          article = manager.create(LessonArticle, {
            ...dto.article,
            content: dto.article.content || '',
            audioUrl: dto.article.audioUrl || '',
            durationSeconds: dto.article.durationSeconds || 0,
            lesson,
          });
          await manager.save(LessonArticle, article);
        }
      }

      // 3. Cập nhật Vocabularies (1:N)
      if (dto.vocabularies !== undefined) {
        // Xóa các từ vựng cũ thuộc lesson này
        await manager.delete(LessonVocabulary, { lesson: { id: lessonId } });

        // Tạo lại danh sách từ vựng mới
        if (dto.vocabularies.length > 0) {
          const newVocabs = dto.vocabularies.map((v, index) =>
            manager.create(LessonVocabulary, {
              word: v.word,
              definitionEn: v.definitionEn || '',
              exampleSentence: v.exampleSentence || '',
              orderIndex: v.orderIndex ?? index + 1,
              lesson,
            }),
          );
          await manager.save(LessonVocabulary, newVocabs);
        }
      }

      // 4. Cập nhật Audios (1:N)
      if (dto.audios !== undefined) {
        // Xóa các audio cũ thuộc lesson này
        await manager.delete(LessonAudio, { lesson: { id: lessonId } });

        // Tạo lại danh sách audio mới
        if (dto.audios.length > 0) {
          const newAudios = dto.audios.map((a, index) =>
            manager.create(LessonAudio, {
              audioType: a.audioType,
              title: a.title,
              audioUrl: a.audioUrl,
              transcript: a.transcript || '',
              durationSeconds: a.durationSeconds || 0,
              orderIndex: a.orderIndex ?? index + 1,
              lesson,
            }),
          );
          await manager.save(LessonAudio, newAudios);
        }
      }
    });

    this.logger.log(`Updated lesson studio content: '${lesson.title}' (${lessonId})`);
    return this.findOne(lessonId);
  }

  /**
   * Xóa bài học
   */
  async delete(
    idOrSlug: string,
    courseIdOrSlug?: string,
  ): Promise<{ success: boolean; message: string }> {
    const lesson = await this.findLessonEntity(idOrSlug, courseIdOrSlug);

    await this.lessonRepository.remove(lesson);
    this.logger.log(`Deleted lesson: '${lesson.title}' (${lesson.id})`);

    return {
      success: true,
      message: `Đã xóa thành công bài học '${lesson.title}'`,
    };
  }

  /**
   * Sắp xếp lại thứ tự các bài học trong khóa học (Drag & Drop Reordering) trong 1 Transaction
   */
  async reorder(
    courseIdOrSlug: string,
    lessonIds: string[],
  ): Promise<AdminLessonSummaryDto[]> {
    const course = await this.findCourseEntity(courseIdOrSlug);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < lessonIds.length; i++) {
        await queryRunner.manager.update(
          Lesson,
          { id: lessonIds[i], course: { id: course.id } },
          { orderIndex: i + 1 },
        );
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `Reordered ${lessonIds.length} lessons in course '${course.slug}' successfully`,
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to reorder lessons in course '${course.slug}'`,
        err,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }

    return this.findByCourse(course.id);
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