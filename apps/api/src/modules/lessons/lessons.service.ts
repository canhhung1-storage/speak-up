import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../database/entities/lesson.entity';
import { LessonDetailResponseDto } from './dto/lesson-detail-response.dto';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class LessonsService {
  private readonly logger = new Logger(LessonsService.name);

  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  /**
   * Lấy chi tiết bài học theo Course Slug (hoặc UUID) và Lesson Slug (hoặc UUID)
   */
  async findByCourseAndLessonSlug(
    courseSlugOrId: string,
    lessonSlugOrId: string,
  ): Promise<LessonDetailResponseDto> {
    this.logger.log(
      `Fetching lesson: course='${courseSlugOrId}', lesson='${lessonSlugOrId}'`,
    );

    const isCourseUuid = UUID_REGEX.test(courseSlugOrId);
    const isLessonUuid = UUID_REGEX.test(lessonSlugOrId);

    const query = this.lessonRepository
      .createQueryBuilder('lesson')
      .innerJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.article', 'article')
      .leftJoinAndSelect('lesson.vocabularies', 'vocabularies')
      .leftJoinAndSelect('lesson.audios', 'audios');

    if (isCourseUuid) {
      query.where('course.id = :courseRef', { courseRef: courseSlugOrId });
    } else {
      query.where('course.slug = :courseRef', { courseRef: courseSlugOrId });
    }

    if (isLessonUuid) {
      query.andWhere('lesson.id = :lessonRef', { lessonRef: lessonSlugOrId });
    } else {
      query.andWhere('lesson.slug = :lessonRef', { lessonRef: lessonSlugOrId });
    }

    const lesson = await query
      .orderBy('vocabularies.orderIndex', 'ASC')
      .addOrderBy('audios.orderIndex', 'ASC')
      .getOne();

    if (!lesson) {
      throw new NotFoundException(
        `Lesson '${lessonSlugOrId}' not found in course '${courseSlugOrId}'`,
      );
    }

    return {
      id: lesson.id,
      courseId: lesson.course.id,
      courseSlug: lesson.course.slug,
      courseTitle: lesson.course.title,
      title: lesson.title,
      slug: lesson.slug,
      orderIndex: lesson.orderIndex,
      description: lesson.description,
      article: lesson.article
        ? {
            id: lesson.article.id,
            title: lesson.article.title,
            content: lesson.article.content,
            audioUrl: lesson.article.audioUrl,
            durationSeconds: lesson.article.durationSeconds,
          }
        : null,
      vocabularies: (lesson.vocabularies || []).map((vocab) => ({
        id: vocab.id,
        word: vocab.word,
        definitionEn: vocab.definitionEn,
        exampleSentence: vocab.exampleSentence,
        orderIndex: vocab.orderIndex,
      })),
      audios: (lesson.audios || []).map((audio) => ({
        id: audio.id,
        audioType: audio.audioType,
        title: audio.title,
        audioUrl: audio.audioUrl,
        transcript: audio.transcript,
        durationSeconds: audio.durationSeconds,
        orderIndex: audio.orderIndex,
      })),
    };
  }
}