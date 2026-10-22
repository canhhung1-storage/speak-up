export class CourseResponseDto {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: string;
  orderIndex: number;
  totalLessons: number;
  createdAt: Date;
}

export class LessonSummaryDto {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  description: string | null;
}

export class CourseDetailResponseDto extends CourseResponseDto {
  lessons: LessonSummaryDto[];
}
