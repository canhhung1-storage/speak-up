export class LessonArticleDto {
  id: string;
  title: string;
  content: string;
  audioUrl: string;
  durationSeconds: number;
}

export class LessonVocabularyDto {
  id: string;
  word: string;
  ipa: string | null;
  meaningVi: string;
  definitionEn: string | null;
  exampleSentence: string | null;
  audioUrl: string | null;
  orderIndex: number;
}

export class LessonAudioDto {
  id: string;
  audioType: string;
  title: string;
  audioUrl: string;
  transcript: string | null;
  durationSeconds: number;
  orderIndex: number;
}

export class LessonDetailResponseDto {
  id: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  title: string;
  slug: string;
  orderIndex: number;
  description: string | null;
  vocabAudioUrl: string | null;
  article: LessonArticleDto | null;
  vocabularies: LessonVocabularyDto[];
  audios: LessonAudioDto[];
}
