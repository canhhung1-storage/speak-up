import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Course,
  Lesson,
  LessonArticle,
  LessonVocabulary,
  LessonAudio,
} from '../../database/entities';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminCoursesController } from './controllers/admin-courses.controller';
import { AdminLessonsController } from './controllers/admin-lessons.controller';
import { AdminCoursesService } from './services/admin-courses.service';
import { AdminLessonsService } from './services/admin-lessons.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Lesson,
      LessonArticle,
      LessonVocabulary,
      LessonAudio,
    ]),
  ],
  controllers: [AdminCoursesController, AdminLessonsController],
  providers: [AdminCoursesService, AdminLessonsService, RolesGuard],
  exports: [AdminCoursesService, AdminLessonsService],
})
export class AdminModule {}
