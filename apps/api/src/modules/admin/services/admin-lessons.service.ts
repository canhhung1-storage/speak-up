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

  /**
   * Lấy danh sách tóm tắt tất cả bài học trong một khóa học
   */
  async findByCourse(courseId: string): Promise<AdminLessonSummaryDto[]> {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException(`Khóa học với ID '${courseId}' không tồn tại`);
    }

    const lessons = await this.lessonRepository.find({
      where: { course: { id: courseId } },
      relations: ['article', 'vocabularies', 'audios'],
      order: { orderIndex: 'ASC', createdAt: 'ASC' },
    });

    return lessons.map((lesson) => ({
      id: lesson.id,
      courseId,
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      vocabAudioUrl: lesson.vocabAudioUrl,
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
  async findOne(id: string): Promise<AdminLessonDetailDto> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['course', 'article', 'vocabularies', 'audios'],
      order: {
        vocabularies: { orderIndex: 'ASC' },
        audios: { orderIndex: 'ASC' },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Bài học với ID '${id}' không tồn tại`);
    }

    return {
      id: lesson.id,
      courseId: lesson.course?.id || '',
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      vocabAudioUrl: lesson.vocabAudioUrl,
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
        ipa: v.ipa,
        meaningVi: v.meaningVi,
        definitionEn: v.definitionEn,
        exampleSentence: v.exampleSentence,
        audioUrl: v.audioUrl,
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
  async create(courseId: string, dto: CreateLessonDto): Promise<AdminLessonDetailDto> {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException(`Khóa học với ID '${courseId}' không tồn tại`);
    }

    const slug = dto.slug || this.generateSlug(dto.title);

    // Kiểm tra trùng lặp slug trong cùng một khóa học
    const existing = await this.lessonRepository.findOne({
      where: { slug, course: { id: courseId } },
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
        vocabAudioUrl: dto.vocabAudioUrl,
        orderIndex: dto.orderIndex ?? 1,
        course,
      });

      const saved = await manager.save(Lesson, lesson);

      // Article
      if (dto.article && dto.article.title && dto.article.content) {
        const article = manager.create(LessonArticle, {
          title: dto.article.title,
          content: dto.article.content,
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
            ipa: v.ipa || '',
            meaningVi: v.meaningVi,
            definitionEn: v.definitionEn || '',
            exampleSentence: v.exampleSentence || '',
            audioUrl: v.audioUrl || '',
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

    this.logger.log(`Created lesson '${dto.title}' (${savedId}) in course '${course.title}'`);
    return this.findOne(savedId);
  }

  /**
   * Cập nhật toàn diện bài học (Transactional Save cho Article, Vocabularies và Audios)
   */
  async update(id: string, dto: UpdateLessonDto): Promise<AdminLessonDetailDto> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['course', 'article', 'vocabularies', 'audios'],
    });

    if (!lesson) {
      throw new NotFoundException(`Bài học với ID '${id}' không tồn tại`);
    }

    // Thực hiện trong TypeORM Transaction
    await this.dataSource.transaction(async (manager) => {
      // 1. Cập nhật thông tin cơ bản của Lesson
      if (dto.title !== undefined) lesson.title = dto.title;
      if (dto.slug !== undefined && dto.slug !== lesson.slug) {
        const existing = await manager.findOne(Lesson, {
          where: { slug: dto.slug, course: { id: lesson.course.id } },
        });
        if (existing && existing.id !== id) {
          throw new ConflictException(
            `Slug '${dto.slug}' đã tồn tại trong khóa học này`,
          );
        }
        lesson.slug = dto.slug;
      }
      if (dto.description !== undefined) lesson.description = dto.description;
      if (dto.vocabAudioUrl !== undefined) lesson.vocabAudioUrl = dto.vocabAudioUrl;
      if (dto.orderIndex !== undefined) lesson.orderIndex = dto.orderIndex;

      await manager.save(Lesson, lesson);

      // 2. Cập nhật Article (1:1)
      if (dto.article !== undefined) {
        let article = await manager.findOne(LessonArticle, {
          where: { lesson: { id } },
        });

        if (article) {
          article.title = dto.article.title;
          article.content = dto.article.content;
          article.audioUrl = dto.article.audioUrl || '';
          article.durationSeconds = dto.article.durationSeconds || 0;
          await manager.save(LessonArticle, article);
        } else {
          article = manager.create(LessonArticle, {
            ...dto.article,
            lesson,
          });
          await manager.save(LessonArticle, article);
        }
      }

      // 3. Cập nhật Vocabularies (1:N)
      if (dto.vocabularies !== undefined) {
        // Xóa các từ vựng cũ thuộc lesson này
        await manager.delete(LessonVocabulary, { lesson: { id } });

        // Tạo lại danh sách từ vựng mới
        if (dto.vocabularies.length > 0) {
          const newVocabs = dto.vocabularies.map((v, index) =>
            manager.create(LessonVocabulary, {
              word: v.word,
              ipa: v.ipa || '',
              meaningVi: v.meaningVi,
              definitionEn: v.definitionEn || '',
              exampleSentence: v.exampleSentence || '',
              audioUrl: v.audioUrl || '',
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
        await manager.delete(LessonAudio, { lesson: { id } });

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

    this.logger.log(`Updated lesson studio content: '${lesson.title}' (${id})`);
    return this.findOne(id);
  }

  /**
   * Xóa bài học
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new NotFoundException(`Bài học với ID '${id}' không tồn tại`);
    }

    await this.lessonRepository.remove(lesson);
    this.logger.log(`Deleted lesson: '${lesson.title}' (${id})`);

    return { success: true, message: `Đã xóa thành công bài học '${lesson.title}'` };
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
