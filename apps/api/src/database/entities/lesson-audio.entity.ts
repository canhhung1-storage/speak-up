import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Lesson } from './lesson.entity';

export enum AudioType {
  VOCABULARY = 'VOCABULARY',
  MINI_STORY = 'MINI_STORY',
  COMMENTARY = 'COMMENTARY',
  POV = 'POV',
}

@Entity('lesson_audios')
@Index('idx_lesson_audios_type', ['lessonId', 'audioType'])
export class LessonAudio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'lesson_id', type: 'uuid' })
  lessonId: string;

  @Column({
    type: 'varchar',
    length: 30,
    name: 'audio_type',
  })
  audioType: AudioType;

  @Column({ length: 200 })
  title: string;

  @Column({ name: 'audio_url', length: 500 })
  audioUrl: string;

  @Column({ type: 'text', nullable: true })
  transcript: string;

  @Column({ name: 'duration_seconds', default: 0 })
  durationSeconds: number;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Quan hệ Nhiều - 1 với Bài học
  @ManyToOne(() => Lesson, (lesson) => lesson.audios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
