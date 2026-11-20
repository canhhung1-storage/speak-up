import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('lesson_articles')
export class LessonArticle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lesson_id', type: 'uuid', unique: true })
  lessonId: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true, default: '' })
  content: string;

  @Column({ name: 'audio_url', length: 500, nullable: true, default: '' })
  audioUrl: string;

  @Column({ name: 'duration_seconds', default: 0 })
  durationSeconds: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Quan hệ 1 - 1 với Bài học
  @OneToOne(() => Lesson, (lesson) => lesson.article, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
