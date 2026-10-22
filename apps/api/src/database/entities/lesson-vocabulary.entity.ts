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

  @Column({ length: 100, nullable: true })
  ipa: string;

  @Column({ name: 'meaning_vi', length: 255 })
  meaningVi: string;

  @Column({ name: 'definition_en', type: 'text', nullable: true })
  definitionEn: string;

  @Column({ name: 'example_sentence', type: 'text', nullable: true })
  exampleSentence: string;

  @Column({ name: 'audio_url', length: 500, nullable: true })
  audioUrl: string;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  // Quan hệ Nhiều - 1 với Bài học
  @ManyToOne(() => Lesson, (lesson) => lesson.vocabularies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
