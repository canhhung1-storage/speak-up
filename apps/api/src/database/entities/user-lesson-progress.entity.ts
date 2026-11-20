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
    name: 'last_track_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  lastTrackId?: string;

  @Column({
    name: 'last_played_seconds',
    type: 'integer',
    default: 0,
  })
  lastPlayedSeconds: number;

  @Column({
    name: 'total_time_spent_seconds',
    type: 'integer',
    default: 0,
  })
  totalTimeSpentSeconds: number;

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
