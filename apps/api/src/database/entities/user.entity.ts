import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserLessonProgress } from './user-lesson-progress.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  LEARNER = 'LEARNER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'google_id', length: 255, nullable: true, unique: true })
  googleId?: string;

  @Column({ name: 'password_hash', length: 255, nullable: true })
  passwordHash?: string;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.LEARNER,
  })
  role: UserRole;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Quan hệ 1 - Nhiều với tiến độ học
  @OneToMany(() => UserLessonProgress, (progress) => progress.user)
  progress: UserLessonProgress[];
}
