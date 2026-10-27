import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import {
  LearnerService,
  LearnerLessonDetail,
  LearnerVocabulary,
  LearnerAudioTrack,
} from '../../../core/services/learner.service';

export interface PlayableTrack {
  id: string;
  title: string;
  audioType: string;
  audioUrl: string;
  durationSeconds?: number;
  transcript?: string;
}

export interface PopoverState {
  word: string;
  definitionEn?: string;
  exampleSentence?: string;
  x: number;
  y: number;
}

type WorkspaceTab = 'story' | 'vocab' | 'audios';
type VocabViewMode = 'list' | 'flashcard';

@Component({
  selector: 'app-lesson-workspace',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lesson-workspace.component.html',
  styleUrls: ['./lesson-workspace.component.scss'],
})
export class LessonWorkspaceComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly learnerService = inject(LearnerService);
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);

  @ViewChild('audioPlayerRef') audioPlayerRef?: ElementRef<HTMLAudioElement>;
  @ViewChild('storyContentRef') storyContentRef?: ElementRef<HTMLDivElement>;

  // Route Params & Meta State
  readonly courseSlug = signal<string>('');
  readonly lessonSlug = signal<string>('');
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly lesson = signal<LearnerLessonDetail | null>(null);

  // Tab & View Mode
  readonly activeTab = signal<WorkspaceTab>('story');
  readonly vocabMode = signal<VocabViewMode>('list');

  // Flashcard State
  readonly currentCardIndex = signal<number>(0);
  readonly isCardFlipped = signal<boolean>(false);
  readonly flashcardList = signal<LearnerVocabulary[]>([]);

  // Popover State (Story Word Lookup)
  readonly activePopover = signal<PopoverState | null>(null);

  // Audio Reflex Player State
  readonly playlist = signal<PlayableTrack[]>([]);
  readonly currentTrack = signal<PlayableTrack | null>(null);
  readonly isPlaying = signal<boolean>(false);
  readonly currentTime = signal<number>(0);
  readonly duration = signal<number>(0);
  readonly playbackRate = signal<number>(1.0);
  readonly isMuted = signal<boolean>(false);
  readonly volume = signal<number>(1.0);

  // Formatted Time Computeds
  readonly formattedCurrentTime = computed(() => this.formatSeconds(this.currentTime()));
  readonly formattedDuration = computed(() => this.formatSeconds(this.duration()));
  readonly progressPercent = computed(() => {
    const d = this.duration();
    if (!d || d === 0) return 0;
    return Math.min(100, Math.max(0, (this.currentTime() / d) * 100));
  });

  // Current Card Computed
  readonly currentCard = computed(() => {
    const list = this.flashcardList();
    const idx = this.currentCardIndex();
    return list[idx] || null;
  });

  ngOnInit(): void {
    const cSlug = this.route.snapshot.paramMap.get('courseSlug');
    const lSlug = this.route.snapshot.paramMap.get('lessonSlug');

    if (!cSlug || !lSlug) {
      this.errorMessage.set('Missing course or lesson identifier.');
      this.isLoading.set(false);
      return;
    }

    this.courseSlug.set(cSlug);
    this.lessonSlug.set(lSlug);
    this.loadLessonData(cSlug, lSlug);

    // Keyboard listener for flashcards
    window.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.audioPlayerRef?.nativeElement) {
      this.audioPlayerRef.nativeElement.pause();
    }
  }

  loadLessonData(cSlug: string, lSlug: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.learnerService.getLessonDetail(cSlug, lSlug).subscribe({
      next: (data) => {
        this.lesson.set(data);
        this.flashcardList.set([...data.vocabularies]);

        // Build unified playlist
        const tracks: PlayableTrack[] = [];
        if (data.article?.audioUrl) {
          tracks.push({
            id: 'main-story-article',
            title: 'Main Story: ' + (data.article.title || data.title),
            audioType: 'MAIN_STORY',
            audioUrl: data.article.audioUrl,
            durationSeconds: data.article.durationSeconds,
            transcript: data.article.content,
          });
        }

        if (data.audios && data.audios.length > 0) {
          data.audios.forEach((a: LearnerAudioTrack) => {
            tracks.push({
              id: a.id,
              title: a.title,
              audioType: a.audioType,
              audioUrl: a.audioUrl,
              durationSeconds: a.durationSeconds,
              transcript: a.transcript,
            });
          });
        }

        this.playlist.set(tracks);

        // Auto select first track if available
        if (tracks.length > 0) {
          this.currentTrack.set(tracks[0]);
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load lesson details. Please check your connection and try again.');
        this.isLoading.set(false);
      },
    });
  }

  // --- Story Event Delegation: Interactive Vocab Popover ---
  onStoryClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if clicked element is a highlighted mark or word
    if (target && (target.tagName === 'MARK' || target.classList.contains('vocab-highlight'))) {
      const clickedWord = target.textContent?.trim().toLowerCase();
      if (clickedWord) {
        const found = this.lesson()?.vocabularies.find((v) => {
          const w = v.word.trim().toLowerCase();
          return w === clickedWord || clickedWord.includes(w) || w.includes(clickedWord);
        });

        if (found) {
          const rect = target.getBoundingClientRect();
          this.activePopover.set({
            word: found.word,
            definitionEn: found.definitionEn,
            exampleSentence: found.exampleSentence,
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          });
          event.stopPropagation();
          return;
        }
      }
    }

    // Click outside -> close popover
    if (!target.closest('.vocab-popover-box')) {
      this.activePopover.set(null);
    }
  }

  closePopover(): void {
    this.activePopover.set(null);
  }

  // --- Flashcard Operations ---
  flipCard(): void {
    this.isCardFlipped.set(!this.isCardFlipped());
  }

  nextCard(): void {
    const list = this.flashcardList();
    if (list.length === 0) return;
    this.isCardFlipped.set(false);
    this.currentCardIndex.set((this.currentCardIndex() + 1) % list.length);
  }

  prevCard(): void {
    const list = this.flashcardList();
    if (list.length === 0) return;
    this.isCardFlipped.set(false);
    this.currentCardIndex.set(
      (this.currentCardIndex() - 1 + list.length) % list.length,
    );
  }

  shuffleFlashcards(): void {
    const shuffled = [...this.flashcardList()].sort(() => Math.random() - 0.5);
    this.flashcardList.set(shuffled);
    this.currentCardIndex.set(0);
    this.isCardFlipped.set(false);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.activeTab() === 'vocab' && this.vocabMode() === 'flashcard') {
      if (e.code === 'Space') {
        e.preventDefault();
        this.flipCard();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.nextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.prevCard();
      }
    }
  };

  // --- Audio Reflex Player Controls ---
  selectTrack(track: PlayableTrack): void {
    this.currentTrack.set(track);
    this.isPlaying.set(true);

    const player = this.audioPlayerRef?.nativeElement;
    if (player) {
      player.src = track.audioUrl;
      player.load();
      player.play().catch(() => this.isPlaying.set(false));
    }
  }

  togglePlay(): void {
    const player = this.audioPlayerRef?.nativeElement;
    if (!player) return;

    if (player.paused) {
      player.play().then(() => this.isPlaying.set(true)).catch(() => this.isPlaying.set(false));
    } else {
      player.pause();
      this.isPlaying.set(false);
    }
  }

  skip(seconds: number): void {
    const player = this.audioPlayerRef?.nativeElement;
    if (!player) return;
    player.currentTime = Math.min(
      player.duration || 0,
      Math.max(0, player.currentTime + seconds),
    );
  }

  onScrubberChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const player = this.audioPlayerRef?.nativeElement;
    if (player && player.duration) {
      const targetTime = (parseFloat(input.value) / 100) * player.duration;
      player.currentTime = targetTime;
      this.currentTime.set(targetTime);
    }
  }

  changePlaybackRate(rate: number): void {
    this.playbackRate.set(rate);
    const player = this.audioPlayerRef?.nativeElement;
    if (player) {
      player.playbackRate = rate;
    }
  }

  cyclePlaybackRate(): void {
    const rates = [0.75, 1.0, 1.25, 1.5];
    const current = this.playbackRate();
    const nextIdx = (rates.indexOf(current) + 1) % rates.length;
    this.changePlaybackRate(rates[nextIdx]);
  }

  toggleMute(): void {
    const player = this.audioPlayerRef?.nativeElement;
    if (!player) return;
    player.muted = !player.muted;
    this.isMuted.set(player.muted);
  }

  onAudioTimeUpdate(): void {
    const player = this.audioPlayerRef?.nativeElement;
    if (player) {
      this.currentTime.set(player.currentTime);
    }
  }

  onAudioLoadedMetadata(): void {
    const player = this.audioPlayerRef?.nativeElement;
    if (player && player.duration) {
      this.duration.set(player.duration);
      player.playbackRate = this.playbackRate();
    }
  }

  onAudioEnded(): void {
    this.isPlaying.set(false);
    // Auto advance to next track in playlist
    const list = this.playlist();
    const cur = this.currentTrack();
    if (!cur || list.length <= 1) return;

    const idx = list.findIndex((t) => t.id === cur.id);
    if (idx >= 0 && idx < list.length - 1) {
      this.selectTrack(list[idx + 1]);
    }
  }

  // --- Format Utilities ---
  formatSeconds(totalSeconds: number): string {
    if (!totalSeconds || isNaN(totalSeconds) || totalSeconds < 0) return '0:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  getBadgeClass(type: string): string {
    switch (type) {
      case 'MAIN_STORY':
        return 'badge-main-story';
      case 'VOCABULARY':
        return 'badge-vocab';
      case 'MINI_STORY':
        return 'badge-mini-story';
      case 'POV':
        return 'badge-pov';
      case 'COMMENTARY':
        return 'badge-commentary';
      default:
        return 'badge-default';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'MAIN_STORY':
        return 'Main Story';
      case 'VOCABULARY':
        return 'Vocabulary Audio';
      case 'MINI_STORY':
        return 'Mini-Story (Q&A)';
      case 'POV':
        return 'Point of View';
      case 'COMMENTARY':
        return 'Commentary';
      default:
        return type;
    }
  }
}
