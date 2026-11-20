import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Course } from './course.entity';
import { LessonArticle } from './lesson-article.entity';
import { LessonVocabulary } from './lesson-vocabulary.entity';
import { LessonAudio } from './lesson-audio.entity';
import { UserLessonProgress } from './user-lesson-progress.entity';

@Entity('lessons')
@Unique('uq_course_lesson_slug', ['courseId', 'slug'])
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200 })
  slug: string;

  @Column({ name: 'order_index', default: 1 })
  orderIndex: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Quan hệ Nhiều - 1 với Khóa học
  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  // Quan hệ 1 - 1 với Bài đọc chính
  @OneToOne(() => LessonArticle, (article) => article.lesson)
  article: LessonArticle;

  // Quan hệ 1 - Nhiều với Từ vựng trong bài
  @OneToMany(() => LessonVocabulary, (vocab) => vocab.lesson)
  vocabularies: LessonVocabulary[];

  // Quan hệ 1 - Nhiều với Audio luyện nghe (Mini Story, Commentary, POV)
  @OneToMany(() => LessonAudio, (audio) => audio.lesson)
  audios: LessonAudio[];

  // Quan hệ 1 - Nhiều với Tiến độ học
  @OneToMany(() => UserLessonProgress, (progress) => progress.lesson)
  progress: UserLessonProgress[];
}
