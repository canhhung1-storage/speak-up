import { DataSource } from 'typeorm';
import {
  User,
  UserRole,
  Course,
  CourseLevel,
  Lesson,
  LessonArticle,
  LessonVocabulary,
  LessonAudio,
  AudioType,
  UserLessonProgress,
} from '../entities';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'speakup_user',
  password: process.env.POSTGRES_PASSWORD || 'speakup_secret_pass',
  database: process.env.POSTGRES_DB || 'speakup_db',
  entities: [
    User,
    Course,
    Lesson,
    LessonArticle,
    LessonVocabulary,
    LessonAudio,
    UserLessonProgress,
  ],
  synchronize: false,
});

async function runSeed() {
  console.log('🌱 [Seed] Connecting to PostgreSQL database...');
  await AppDataSource.initialize();
  console.log('✅ [Seed] Database connection established.');

  const userRepo = AppDataSource.getRepository(User);
  const courseRepo = AppDataSource.getRepository(Course);
  const lessonRepo = AppDataSource.getRepository(Lesson);
  const articleRepo = AppDataSource.getRepository(LessonArticle);
  const vocabRepo = AppDataSource.getRepository(LessonVocabulary);
  const audioRepo = AppDataSource.getRepository(LessonAudio);

  // 1. Seed Users
  let admin = await userRepo.findOne({ where: { email: 'admin@speakup.com' } });
  if (!admin) {
    admin = userRepo.create({
      email: 'admin@speakup.com',
      passwordHash: '$2b$10$WkG2p4.Y7E09l6bB6ZkGoejPZZiJkS9U43Xl1790r6Q0y51K6X1.e', // bcrypt hash placeholder
      fullName: 'System Administrator',
      role: UserRole.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    await userRepo.save(admin);
    console.log('👤 [Seed] Created Admin user: admin@speakup.com');
  }

  let learner = await userRepo.findOne({ where: { email: 'learner@speakup.com' } });
  if (!learner) {
    learner = userRepo.create({
      email: 'learner@speakup.com',
      passwordHash: '$2b$10$WkG2p4.Y7E09l6bB6ZkGoejPZZiJkS9U43Xl1790r6Q0y51K6X1.e',
      fullName: 'Demo Learner',
      role: UserRole.LEARNER,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    });
    await userRepo.save(learner);
    console.log('👤 [Seed] Created Learner user: learner@speakup.com');
  }

  // 2. Seed Course
  let course = await courseRepo.findOne({ where: { slug: 'power-english' } });
  if (!course) {
    course = courseRepo.create({
      title: 'Power English',
      slug: 'power-english',
      description:
        'Khóa học tiếng Anh giao tiếp phản xạ tự nhiên theo phương pháp Effortless English của thầy AJ Hoge. Học qua nghe sâu, phản xạ không cần suy nghĩ ngữ pháp.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
      level: CourseLevel.INTERMEDIATE,
      isPublished: true,
      orderIndex: 1,
    });
    await courseRepo.save(course);
    console.log('📚 [Seed] Created Course: Power English (slug: power-english)');
  }

  // 3. Seed Lesson: A Kiss
  let lesson = await lessonRepo.findOne({
    where: { courseId: course.id, slug: 'a-kiss' },
  });

  if (!lesson) {
    lesson = lessonRepo.create({
      courseId: course.id,
      title: 'A Kiss',
      slug: 'a-kiss',
      orderIndex: 1,
      description:
        'Bài học mở đầu kinh điển kể về câu chuyện Carlos mua xe mới và gặp một cô gái xinh đẹp trên đường.',
      vocabAudioUrl: 'https://assets.speakup.internal/audio/a-kiss-vocab.mp3',
    });
    await lessonRepo.save(lesson);
    console.log('📖 [Seed] Created Lesson: A Kiss (slug: a-kiss)');

    // 4. Seed LessonArticle
    const article = articleRepo.create({
      lessonId: lesson.id,
      title: 'A Kiss - Main Story',
      content:
        `Carlos buys a new car. It's very expensive. It's a <mark>huge</mark>, blue, fast car. ` +
        `While driving down the street, Carlos sees a girl on a bicycle. She has long blond hair and is <mark>gorgeous</mark>. ` +
        `He <mark>yells</mark> to her, "What's up?" She <mark>ignores</mark> him. He yells, "How's it going?" ` +
        `She keeps going and ignores him. He yells, "Hey, why won't you talk to me? I want to go to dinner with you. ` +
        `I'll take you to an expensive restaurant." The girl turns, gets off the bike, and looks at him. ` +
        `She says, "I don't want to go to dinner. But if you give me your car, I will give you a surprise." ` +
        `Carlos says, "OK!" He jumps out of the car. He gives her the keys and says, "Here are the keys." ` +
        `The beautiful blonde takes the keys and then kisses Carlos on the cheek. Then she jumps into the car and drives away. ` +
        `Carlos stands on the sidewalk. Now he has no car and no girl. He says, "That's it, just a kiss on the cheek?" ` +
        `He gets on her bike and rides home.`,
      audioUrl: 'https://assets.speakup.internal/audio/a-kiss-article.mp3',
      durationSeconds: 154,
    });
    await articleRepo.save(article);
    console.log('📝 [Seed] Created Article for Lesson: A Kiss');

    // 5. Seed LessonVocabularies
    const vocabularies = [
      {
        lessonId: lesson.id,
        word: 'huge',
        ipa: '/hjuːdʒ/',
        meaningVi: 'Cực kỳ to lớn, khổng lồ',
        definitionEn: 'Extremely large; enormous',
        exampleSentence: "It's a huge, blue, fast car.",
        audioUrl: 'https://assets.speakup.internal/audio/vocab/huge.mp3',
        orderIndex: 1,
      },
      {
        lessonId: lesson.id,
        word: 'gorgeous',
        ipa: '/ˈɡɔːrdʒəs/',
        meaningVi: 'Xinh đẹp lộng lẫy, quyến rũ',
        definitionEn: 'Very attractive or pleasant',
        exampleSentence: 'She has long blond hair and is gorgeous.',
        audioUrl: 'https://assets.speakup.internal/audio/vocab/gorgeous.mp3',
        orderIndex: 2,
      },
      {
        lessonId: lesson.id,
        word: 'yell',
        ipa: '/jel/',
        meaningVi: 'La lớn, hét to',
        definitionEn: 'To shout something or make a loud noise',
        exampleSentence: 'He yells to her, "What\'s up?"',
        audioUrl: 'https://assets.speakup.internal/audio/vocab/yell.mp3',
        orderIndex: 3,
      },
      {
        lessonId: lesson.id,
        word: 'ignore',
        ipa: '/ɪɡˈnɔːr/',
        meaningVi: 'Phớt lờ, làm ngơ',
        definitionEn: 'To pay no attention to something or someone',
        exampleSentence: 'She keeps going and ignores him.',
        audioUrl: 'https://assets.speakup.internal/audio/vocab/ignore.mp3',
        orderIndex: 4,
      },
      {
        lessonId: lesson.id,
        word: 'whisper',
        ipa: '/ˈwɪspər/',
        meaningVi: 'Thì thầm, nói nhỏ',
        definitionEn: 'To speak very softly using one\'s breath',
        exampleSentence: 'He whispers in her ear.',
        audioUrl: 'https://assets.speakup.internal/audio/vocab/whisper.mp3',
        orderIndex: 5,
      },
    ];
    await vocabRepo.save(vocabRepo.create(vocabularies));
    console.log('🔤 [Seed] Created 5 Vocabulary items for A Kiss');

    // 6. Seed LessonAudios
    const audios = [
      {
        lessonId: lesson.id,
        audioType: AudioType.MINI_STORY,
        title: 'A Kiss - Mini Story A',
        audioUrl: 'https://assets.speakup.internal/audio/a-kiss-mini-story-a.mp3',
        transcript:
          'Carlos bought a new car. Did Carlos buy a new car? Yes, he did. He bought a new car. ' +
          'Was the car cheap or expensive? It was expensive. Carlos bought a very expensive car...',
        durationSeconds: 620,
        orderIndex: 1,
      },
      {
        lessonId: lesson.id,
        audioType: AudioType.POV,
        title: 'A Kiss - Point of View (Past to Future)',
        audioUrl: 'https://assets.speakup.internal/audio/a-kiss-pov.mp3',
        transcript:
          'Since last year, Carlos has had a dream. In the future, Carlos will buy a new car. ' +
          'It will be a huge, blue, fast car...',
        durationSeconds: 430,
        orderIndex: 2,
      },
      {
        lessonId: lesson.id,
        audioType: AudioType.COMMENTARY,
        title: 'A Kiss - Commentary',
        audioUrl: 'https://assets.speakup.internal/audio/a-kiss-commentary.mp3',
        transcript:
          'Welcome to the commentary for A Kiss. Today we talk about taking initiative and learning with enthusiasm...',
        durationSeconds: 510,
        orderIndex: 3,
      },
    ];
    await audioRepo.save(audioRepo.create(audios));
    console.log('🎧 [Seed] Created 3 Audio lessons (Mini Story, POV, Commentary) for A Kiss');
  }

  console.log('🎉 [Seed] Seeding completed successfully!');
  await AppDataSource.destroy();
}

runSeed().catch(async (error) => {
  console.error('❌ [Seed] Error running seed script:', error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
