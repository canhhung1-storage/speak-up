import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_daily_study_logs')
@Unique('uq_user_daily_study', ['userId', 'studyDate'])
export class UserDailyStudyLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Index()
  @Column({ name: 'study_date', type: 'date' })
  studyDate: string;

  @Column({
    name: 'total_seconds',
    type: 'integer',
    default: 0,
  })
  totalSeconds: number;

  @Column({
    name: 'lessons_count',
    type: 'integer',
    default: 0,
  })
  lessonsCount: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Quan hệ Nhiều - 1 với User
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
