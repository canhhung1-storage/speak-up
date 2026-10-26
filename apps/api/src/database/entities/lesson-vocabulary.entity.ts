import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('lesson_vocabularies')
export class LessonVocabulary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'lesson_id', type: 'uuid' })
  lessonId: string;

  @Column({ length: 100 })
  word: string;

  @Column({ name: 'definition_en', type: 'text', nullable: true })
  definitionEn: string;

  @Column({ name: 'example_sentence', type: 'text', nullable: true })
  exampleSentence: string;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  // Quan hệ Nhiều - 1 với Bài học
  @ManyToOne(() => Lesson, (lesson) => lesson.vocabularies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
