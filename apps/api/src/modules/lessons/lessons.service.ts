import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../database/entities/lesson.entity';
import { LessonDetailResponseDto } from './dto/lesson-detail-response.dto';

@Injectable()
export class LessonsService {
  private readonly logger = new Logger(LessonsService.name);

  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  /**
   * Lấy chi tiết bài học theo Course Slug và Lesson Slug kèm Article, Vocabularies và Audios
   */
  async findByCourseAndLessonSlug(
    courseSlug: string,
    lessonSlug: string,
  ): Promise<LessonDetailResponseDto> {
    this.logger.log(
      `Fetching lesson: courseSlug='${courseSlug}', lessonSlug='${lessonSlug}'`,
    );

    const lesson = await this.lessonRepository
      .createQueryBuilder('lesson')
      .innerJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.article', 'article')
      .leftJoinAndSelect('lesson.vocabularies', 'vocabularies')
      .leftJoinAndSelect('lesson.audios', 'audios')
      .where('course.slug = :courseSlug', { courseSlug })
      .andWhere('lesson.slug = :lessonSlug', { lessonSlug })
      .orderBy('vocabularies.orderIndex', 'ASC')
      .addOrderBy('audios.orderIndex', 'ASC')
      .getOne();

    if (!lesson) {
      throw new NotFoundException(
        `Lesson '${lessonSlug}' not found in course '${courseSlug}'`,
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
      vocabAudioUrl: lesson.vocabAudioUrl,
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
        ipa: vocab.ipa,
        meaningVi: vocab.meaningVi,
        definitionEn: vocab.definitionEn,
        exampleSentence: vocab.exampleSentence,
        audioUrl: vocab.audioUrl,
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
