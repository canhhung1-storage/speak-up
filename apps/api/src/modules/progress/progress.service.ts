import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  UserLessonProgress,
  ProgressStatus,
} from '../../database/entities/user-lesson-progress.entity';
import { UserDailyStudyLog } from '../../database/entities/user-daily-study-log.entity';
import { Course } from '../../database/entities/course.entity';
import { Lesson } from '../../database/entities/lesson.entity';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { LessonProgressResponseDto } from './dto/lesson-progress-response.dto';
import { CourseProgressResponseDto } from './dto/course-progress-response.dto';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);

  constructor(
    @InjectRepository(UserLessonProgress)
    private readonly progressRepository: Repository<UserLessonProgress>,
    @InjectRepository(UserDailyStudyLog)
    private readonly dailyStudyLogRepository: Repository<UserDailyStudyLog>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  /**
   * Retrieves overall course progress for a user including lesson completion states.
   */
  async getCourseProgress(
    userId: string,
    courseSlugOrId: string,
  ): Promise<CourseProgressResponseDto> {
    const isUuid = UUID_REGEX.test(courseSlugOrId);
    const course = await this.courseRepository.findOne({
      where: isUuid ? { id: courseSlugOrId } : { slug: courseSlugOrId },
      relations: ['lessons'],
    });

    if (!course) {
      throw new NotFoundException(`Course not found: ${courseSlugOrId}`);
    }

    // Sort lessons by orderIndex
    const sortedLessons = (course.lessons || []).sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );

    const lessonIds = sortedLessons.map((l) => l.id);
    const progresses =
      lessonIds.length > 0
        ? await this.progressRepository.find({
            where: { userId, lessonId: In(lessonIds) },
          })
        : [];

    const progressMap = new Map<string, UserLessonProgress>();
    progresses.forEach((p) => progressMap.set(p.lessonId, p));

    let completedCount = 0;
    const lessonResponses: LessonProgressResponseDto[] = sortedLessons.map((lesson) => {
      const p = progressMap.get(lesson.id);
      const isCompleted = p?.status === ProgressStatus.COMPLETED;
      if (isCompleted) {
        completedCount++;
      }

      return {
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
        status: p?.status || ProgressStatus.NOT_STARTED,
        isCompleted,
        lastTrackId: p?.lastTrackId,
        lastPlayedSeconds: p?.lastPlayedSeconds || 0,
        playbackPositions: p?.playbackPositions || {},
        lastListenedAt: p?.lastListenedAt || new Date(0),
        completedAt: p?.completedAt,
      };
    });

    // Find the lesson accessed most recently
    let lastAccessedLessonSlug: string | undefined;
    if (progresses.length > 0) {
      const sortedByAccess = [...progresses].sort(
        (a, b) =>
          new Date(b.lastListenedAt).getTime() - new Date(a.lastListenedAt).getTime(),
      );
      const mostRecentLesson = sortedLessons.find(
        (l) => l.id === sortedByAccess[0].lessonId,
      );
      lastAccessedLessonSlug = mostRecentLesson?.slug;
    }

    const totalLessons = sortedLessons.length;
    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return {
      courseId: course.id,
      courseSlug: course.slug,
      totalLessons,
      completedLessons: completedCount,
      progressPercent,
      lastAccessedLessonSlug,
      lessons: lessonResponses,
    };
  }

  /**
   * Retrieves single lesson progress for an active learner.
   */
  async getLessonProgress(
    userId: string,
    lessonSlugOrId: string,
    courseSlugOrId?: string,
  ): Promise<LessonProgressResponseDto> {
    const lesson = await this.resolveLesson(lessonSlugOrId, courseSlugOrId);

    const p = await this.progressRepository.findOne({
      where: { userId, lessonId: lesson.id },
    });

    if (!p) {
      return {
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
        status: ProgressStatus.NOT_STARTED,
        isCompleted: false,
        lastPlayedSeconds: 0,
        playbackPositions: {},
        lastListenedAt: new Date(0),
      };
    }

    return {
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      status: p.status,
      isCompleted: p.status === ProgressStatus.COMPLETED,
      lastTrackId: p.lastTrackId,
      lastPlayedSeconds: p.lastPlayedSeconds || 0,
      playbackPositions: p.playbackPositions || {},
      lastListenedAt: p.lastListenedAt,
      completedAt: p.completedAt,
    };
  }

  /**
   * Updates or inserts learning progress for a lesson (playback position, active track, completed status).
   */
  async updateLessonProgress(
    userId: string,
    lessonSlugOrId: string,
    dto: UpdateProgressDto,
    courseSlugOrId?: string,
  ): Promise<LessonProgressResponseDto> {
    const lesson = await this.resolveLesson(lessonSlugOrId, courseSlugOrId);

    let progress = await this.progressRepository.findOne({
      where: { userId, lessonId: lesson.id },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        userId,
        lessonId: lesson.id,
        status: ProgressStatus.IN_PROGRESS,
        playbackPositions: {},
        lastPlayedSeconds: 0,
      });
    }

    // 1. Completion / Status update
    if (dto.isCompleted !== undefined) {
      if (dto.isCompleted) {
        progress.status = ProgressStatus.COMPLETED;
        if (!progress.completedAt) {
          progress.completedAt = new Date();
        }
      } else {
        progress.status = ProgressStatus.IN_PROGRESS;
        progress.completedAt = undefined as unknown as Date;
      }
    } else if (dto.status) {
      progress.status = dto.status;
      if (dto.status === ProgressStatus.COMPLETED) {
        if (!progress.completedAt) {
          progress.completedAt = new Date();
        }
      } else {
        progress.completedAt = undefined as unknown as Date;
      }
    }

    // 2. Track & Playback position update
    if (dto.lastTrackId) {
      progress.lastTrackId = dto.lastTrackId;
    }

    if (dto.lastPlayedSeconds !== undefined) {
      progress.lastPlayedSeconds = Math.max(0, Math.round(dto.lastPlayedSeconds));
      if (progress.lastTrackId) {
        progress.playbackPositions = {
          ...(progress.playbackPositions || {}),
          [progress.lastTrackId]: progress.lastPlayedSeconds,
        };
      }
    }

    if (dto.playbackPositions) {
      progress.playbackPositions = {
        ...(progress.playbackPositions || {}),
        ...dto.playbackPositions,
      };
    }

    // 3. Time spent delta tracking & daily activity aggregation
    if (dto.timeSpentDeltaSeconds && dto.timeSpentDeltaSeconds > 0) {
      const delta = Math.min(60, Math.max(1, Math.round(dto.timeSpentDeltaSeconds)));
      progress.totalTimeSpentSeconds = (progress.totalTimeSpentSeconds || 0) + delta;

      try {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        let dailyLog = await this.dailyStudyLogRepository.findOne({
          where: { userId, studyDate: todayStr },
        });

        if (dailyLog) {
          dailyLog.totalSeconds += delta;
          await this.dailyStudyLogRepository.save(dailyLog);
        } else {
          dailyLog = this.dailyStudyLogRepository.create({
            userId,
            studyDate: todayStr,
            totalSeconds: delta,
            lessonsCount: 1,
          });
          await this.dailyStudyLogRepository.save(dailyLog);
        }
      } catch (err) {
        this.logger.warn(`Failed to update daily study log: ${err}`);
      }
    }

    progress.lastListenedAt = new Date();

    const saved = await this.progressRepository.save(progress);
    this.logger.debug(
      `Updated progress: user=${userId}, lesson=${lesson.slug}, status=${saved.status}, seconds=${saved.lastPlayedSeconds}`,
    );

    return {
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      status: saved.status,
      isCompleted: saved.status === ProgressStatus.COMPLETED,
      lastTrackId: saved.lastTrackId,
      lastPlayedSeconds: saved.lastPlayedSeconds || 0,
      playbackPositions: saved.playbackPositions || {},
      lastListenedAt: saved.lastListenedAt,
      completedAt: saved.completedAt,
    };
  }

  /**
   * Helper method to resolve lesson by UUID or slug with optional course context.
   */
  private async resolveLesson(
    lessonSlugOrId: string,
    courseSlugOrId?: string,
  ): Promise<Lesson> {
    const isUuid = UUID_REGEX.test(lessonSlugOrId);

    if (isUuid) {
      const lesson = await this.lessonRepository.findOne({
        where: { id: lessonSlugOrId },
      });
      if (!lesson) {
        throw new NotFoundException(`Lesson not found: ${lessonSlugOrId}`);
      }
      return lesson;
    }

    // Resolve by slug
    let courseId: string | undefined;
    if (courseSlugOrId) {
      const isCourseUuid = UUID_REGEX.test(courseSlugOrId);
      const course = await this.courseRepository.findOne({
        where: isCourseUuid ? { id: courseSlugOrId } : { slug: courseSlugOrId },
        select: ['id'],
      });
      if (course) {
        courseId = course.id;
      }
    }

    const whereClause = courseId
      ? { slug: lessonSlugOrId, courseId }
      : { slug: lessonSlugOrId };

    const lesson = await this.lessonRepository.findOne({ where: whereClause });
    if (!lesson) {
      throw new NotFoundException(`Lesson not found: ${lessonSlugOrId}`);
    }

    return lesson;
  }
}
