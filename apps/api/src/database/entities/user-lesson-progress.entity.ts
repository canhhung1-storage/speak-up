import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';

export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('user_lesson_progress')
@Unique('uq_user_lesson_progress', ['userId', 'lessonId'])
export class UserLessonProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Index()
  @Column({ name: 'lesson_id', type: 'uuid' })
  lessonId: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: ProgressStatus.NOT_STARTED,
  })
  status: ProgressStatus;

  @Column({
    type: 'jsonb',
    name: 'playback_positions',
    default: () => "'{}'",
  })
  playbackPositions: Record<string, number>;

  @Column({
    name: 'last_listened_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastListenedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date;

  // Quan hệ Nhiều - 1 với User
  @ManyToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Quan hệ Nhiều - 1 với Lesson
  @ManyToOne(() => Lesson, (lesson) => lesson.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
