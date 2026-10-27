import { Component, OnInit, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AdminService,
  AdminLessonDetail,
  AdminCourse,
  AdminArticle,
  AdminVocabulary,
  AdminAudio,
  CreateLessonDto,
  UpdateLessonDto,
} from '../../../core/services/admin.service';

type StudioTab = 'article' | 'vocabularies' | 'audios';

@Component({
  selector: 'app-lesson-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="studio-container">
      <!-- Top Action Bar -->
      <div class="studio-topbar">
        <div class="topbar-left">
          <a [routerLink]="['/admin/courses', courseSlug() || courseId(), 'lessons']" class="btn-back" title="Back to Lesson List">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>
          <div class="studio-meta">
            <h2>{{ isEditing() ? 'Studio: ' + lessonTitle() : 'Add New Lesson' }}</h2>
            <span class="course-ref">Course: {{ course()?.title || 'Loading...' }}</span>
          </div>
        </div>

        <div class="topbar-right">
          <button
            class="btn-save"
            (click)="saveLesson()"
            [disabled]="isSaving() || !lessonTitle().trim()"
          >
            <svg *ngIf="!isSaving()" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>{{ isSaving() ? 'Saving lesson...' : 'Save Lesson' }}</span>
          </button>
        </div>
      </div>

      <!-- Basic Lesson Meta Card -->
      <div class="meta-card">
        <div class="meta-grid">
          <div class="form-group">
            <label>Lesson Title *</label>
            <input
              type="text"
              [ngModel]="lessonTitle()"
              (ngModelChange)="onTitleChange($event)"
              placeholder="e.g. Day 1: A Kiss, Flow English..."
            />
          </div>

          <div class="form-group">
            <label>URL Slug</label>
            <input
              type="text"
              [(ngModel)]="lessonSlug"
              placeholder="a-kiss"
            />
          </div>

          <div class="form-group">
            <label>Lesson Order</label>
            <input
              type="number"
              [(ngModel)]="orderIndex"
              min="1"
            />
          </div>
        </div>

        <div class="form-group" style="margin-top: 1rem;">
          <label>Lesson Description</label>
          <textarea
            rows="2"
            [(ngModel)]="description"
            placeholder="Brief summary of the lesson story and reflex method..."
          ></textarea>
        </div>
      </div>

      <!-- 3-Tab Studio Card -->
      <div class="tabs-card">
        <!-- Tabs Header Navigation -->
        <div class="tabs-nav">
          <button
            class="tab-btn"
            [class.active]="activeTab() === 'article'"
            (click)="switchTab('article')"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>1. Story Article & Audio</span>
          </button>

          <button
            class="tab-btn"
            [class.active]="activeTab() === 'vocabularies'"
            (click)="switchTab('vocabularies')"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>2. Core Vocabulary</span>
            <span class="badge-counter">{{ vocabularies.length }}</span>
          </button>

          <button
            class="tab-btn"
            [class.active]="activeTab() === 'audios'"
            (click)="switchTab('audios')"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <span>3. Reflex Audio Tracks</span>
            <span class="badge-counter">{{ audios.length }}</span>
          </button>
        </div>

        <!-- Tab 1: Bài Đọc (Article) -->
        <div class="tab-content" *ngIf="activeTab() === 'article'">
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div class="form-group">
              <label>Article Title *</label>
              <input
                type="text"
                [(ngModel)]="article.title"
                placeholder="Story title..."
              />
            </div>

            <div class="form-group">
              <label>Story Narration Audio URL</label>
              <input
                type="text"
                [(ngModel)]="article.audioUrl"
                placeholder="https://example.com/audio/story.mp3"
              />
            </div>

            <div class="audio-tester" *ngIf="article.audioUrl">
              <span style="font-size: 0.8rem; font-weight: 600; color: #10b981;">Preview:</span>
              <audio [src]="article.audioUrl" controls (loadedmetadata)="onArticleAudioLoaded($event)"></audio>
            </div>

            <!-- SpeakUp Story Rich Text Editor -->
            <div class="form-group story-editor-group">
              <div class="editor-header">
                <label>Story Content (Prose / HTML)</label>
                <div class="editor-mode-toggle">
                  <button
                    type="button"
                    class="btn-mode"
                    [class.active]="!isHtmlMode"
                    (click)="setEditorMode(false)"
                  >
                    Visual
                  </button>
                  <button
                    type="button"
                    class="btn-mode"
                    [class.active]="isHtmlMode"
                    (click)="setEditorMode(true)"
                  >
                    &lt;/&gt; Raw HTML
                  </button>
                </div>
              </div>

              <!-- Toolbar for Visual Mode -->
              <div class="editor-toolbar" *ngIf="!isHtmlMode">
                <button
                  type="button"
                  class="toolbar-btn"
                  (click)="execCmd('bold')"
                  title="Bold (Ctrl+B)"
                >
                  <strong>B</strong>
                </button>

                <button
                  type="button"
                  class="toolbar-btn"
                  (click)="execCmd('italic')"
                  title="Italic (Ctrl+I)"
                >
                  <em>I</em>
                </button>

                <button
                  type="button"
                  class="toolbar-btn"
                  (click)="execCmd('underline')"
                  title="Underline (Ctrl+U)"
                >
                  <u>U</u>
                </button>

                <span class="toolbar-divider"></span>

                <!-- SPECIAL VOCABULARY HIGHLIGHT BUTTON -->
                <button
                  type="button"
                  class="toolbar-btn btn-highlight-vocab"
                  (click)="highlightVocabulary()"
                  title="Highlight Vocabulary Word (<mark>)"
                >
                  <span class="highlight-icon">🖍️</span>
                  <span>Highlight Word (&lt;mark&gt;)</span>
                </button>

                <span class="toolbar-divider"></span>

                <button
                  type="button"
                  class="toolbar-btn"
                  (click)="execFormatBlock('h2')"
                  title="Heading 2 (H2)"
                >
                  H2
                </button>

                <button
                  type="button"
                  class="toolbar-btn"
                  (click)="execFormatBlock('h3')"
                  title="Heading 3 (H3)"
                >
                  H3
                </button>

                <button
                  type="button"
                  class="toolbar-btn"
                  (click)="execFormatBlock('p')"
                  title="Paragraph (P)"
                >
                  ¶ Paragraph
                </button>

                <button
                  type="button"
                  class="toolbar-btn"
                  (click)="execFormatBlock('blockquote')"
                  title="Quote"
                >
                  “”
                </button>

                <span class="toolbar-divider"></span>

                <button
                  type="button"
                  class="toolbar-btn"
                  (click)="execCmd('insertUnorderedList')"
                  title="Bullet List"
                >
                  • Bullet List
                </button>

                <button
                  type="button"
                  class="toolbar-btn"
                  (click)="execCmd('removeFormat')"
                  title="Clear Formatting"
                >
                  🧹 Clear Style
                </button>
              </div>

              <!-- Visual Editable Area -->
              <div
                #editorContainer
                *ngIf="!isHtmlMode"
                class="editor-editable-area"
                contenteditable="true"
                (input)="onEditorInput()"
                placeholder="Type or paste the English story content... Select words and click 'Highlight Word' to mark vocabulary for interactive lookup."
              ></div>

              <!-- Raw HTML Mode -->
              <textarea
                *ngIf="isHtmlMode"
                rows="15"
                class="editor-raw-textarea"
                [(ngModel)]="article.content"
                placeholder="Type or paste raw HTML story content..."
              ></textarea>

              <div class="editor-footer">
                <span class="helper-text">
                  💡 Tip: Highlight words or phrases and click <strong>🖍️ Highlight Word</strong> to create interactive vocabulary lookups for learners.
                </span>
                <span class="word-counter">{{ getWordCount(article.content) }} words</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Từ Vựng (Vocabulary) -->
        <div class="tab-content" *ngIf="activeTab() === 'vocabularies'">
          <div class="vocab-cards-grid">
            <div
              class="item-card"
              *ngFor="let vocab of vocabularies; let i = index"
            >
              <div class="item-header">
                <span class="item-badge">Vocabulary #{{ i + 1 }}</span>
                <button class="btn-remove" (click)="removeVocabulary(i)">Remove word</button>
              </div>

              <!-- Row 1: Word -->
              <div class="form-group">
                <label>Word / Phrase (English) *</label>
                <input
                  type="text"
                  [(ngModel)]="vocab.word"
                  placeholder="e.g. gorgeous, a raise"
                />
              </div>

              <!-- Row 2: Definition EN -->
              <div class="form-group">
                <label>English Definition (Definition EN)</label>
                <input
                  type="text"
                  [(ngModel)]="vocab.definitionEn"
                  placeholder="Extremely beautiful or attractive; a pay increase (for a job)"
                />
              </div>

              <!-- Row 3: Example sentence -->
              <div class="form-group">
                <label>Context Example Sentence</label>
                <input
                  type="text"
                  [(ngModel)]="vocab.exampleSentence"
                  placeholder="She is a gorgeous girl with long hair."
                />
              </div>
            </div>
          </div>

          <button class="btn-add-item" (click)="addVocabulary()">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Add New Vocabulary</span>
          </button>
        </div>

        <!-- Tab 3: Audio Phụ (Audios) -->
        <div class="tab-content" *ngIf="activeTab() === 'audios'">
          <div class="studio-item-list">
            <div
              class="item-card"
              *ngFor="let audio of audios; let i = index"
            >
              <div class="item-header">
                <span class="item-badge" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b;">
                  Track #{{ i + 1 }}: {{ audio.audioType }}
                </span>
                <button class="btn-remove" (click)="removeAudio(i)">Remove track</button>
              </div>

              <div class="audio-track-grid">
                <div class="form-group">
                  <label>Audio Type *</label>
                  <select [(ngModel)]="audio.audioType">
                    <option value="VOCABULARY">VOCABULARY (Vocabulary Explanation)</option>
                    <option value="MINI_STORY">MINI_STORY (Reflex Q&A)</option>
                    <option value="COMMENTARY">COMMENTARY (Commentary & Insights)</option>
                    <option value="POV">POV (Point of View Stories)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Track Title *</label>
                  <input
                    type="text"
                    [(ngModel)]="audio.title"
                    placeholder="e.g. Mini-Story A - A Kiss"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Audio File URL *</label>
                <input
                  type="text"
                  [(ngModel)]="audio.audioUrl"
                  placeholder="https://.../audio/mini-story-a.mp3"
                />
                <div class="audio-tester" *ngIf="audio.audioUrl">
                  <span style="font-size: 0.8rem; font-weight: 600; color: #10b981;">Preview:</span>
                  <audio [src]="audio.audioUrl" controls (loadedmetadata)="onTrackAudioLoaded(audio, $event)"></audio>
                </div>
              </div>

              <div class="form-group">
                <label>Transcript / Spoken Script</label>
                <textarea
                  rows="6"
                  [(ngModel)]="audio.transcript"
                  placeholder="Full spoken transcript of AJ Hoge for this track..."
                ></textarea>
              </div>
            </div>

            <button class="btn-add-item" (click)="addAudio()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add Reflex Audio Track</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./lesson-editor.component.scss'],
})
export class LessonEditorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminService = inject(AdminService);

  readonly courseSlug = signal<string>('');
  readonly courseId = signal<string>('');
  readonly lessonId = signal<string | null>(null);
  readonly course = signal<AdminCourse | null>(null);
  readonly isEditing = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly activeTab = signal<StudioTab>('article');

  // Lesson Meta State
  readonly lessonTitle = signal<string>('');
  lessonSlug = '';
  description = '';
  orderIndex = 1;

  // Tab 1: Article State
  @ViewChild('editorContainer') editorContainer?: ElementRef<HTMLDivElement>;
  isHtmlMode = false;

  article: AdminArticle = {
    title: '',
    content: '',
    audioUrl: '',
    durationSeconds: 0,
  };

  // Tab 2: Vocabularies State
  vocabularies: AdminVocabulary[] = [];

  // Tab 3: Audios State
  audios: AdminAudio[] = [];

  ngOnInit(): void {
    const cid = this.route.snapshot.paramMap.get('courseSlug') || this.route.snapshot.paramMap.get('courseId');
    const lid = this.route.snapshot.paramMap.get('lessonSlug') || this.route.snapshot.paramMap.get('lessonId');

    if (cid) {
      this.courseSlug.set(cid);
      this.courseId.set(cid);
      this.adminService.getCourse(cid).subscribe((c: AdminCourse) => {
        this.course.set(c);
        if (c.slug) this.courseSlug.set(c.slug);
        if (c.id) this.courseId.set(c.id);
      });
    }

    if (lid && lid !== 'create') {
      this.lessonId.set(lid);
      this.isEditing.set(true);
      this.loadLessonData(lid, cid || undefined);
    }
  }

  loadLessonData(lid: string, cid?: string): void {
    this.adminService.getLesson(lid, cid).subscribe({
      next: (data: AdminLessonDetail) => {
        this.lessonId.set(data.id);
        if (data.courseSlug) this.courseSlug.set(data.courseSlug);
        this.lessonTitle.set(data.title);
        this.lessonSlug = data.slug;
        this.description = data.description || '';
        this.orderIndex = data.orderIndex;

        if (data.article) {
          this.article = {
            id: data.article.id,
            title: data.article.title,
            content: data.article.content,
            audioUrl: data.article.audioUrl || '',
            durationSeconds: data.article.durationSeconds || 0,
          };
        } else {
          this.article = {
            title: data.title,
            content: '',
            audioUrl: '',
            durationSeconds: 0,
          };
        }

        setTimeout(() => {
          if (this.editorContainer?.nativeElement) {
            this.editorContainer.nativeElement.innerHTML = this.article.content || '';
          }
        }, 50);

        this.vocabularies = (data.vocabularies || []).map((v: AdminVocabulary, idx: number) => ({
          id: v.id,
          word: v.word,
          definitionEn: v.definitionEn || '',
          exampleSentence: v.exampleSentence || '',
          orderIndex: v.orderIndex || idx + 1,
        }));

        this.audios = (data.audios || []).map((a: AdminAudio, idx: number) => ({
          id: a.id,
          audioType: a.audioType,
          title: a.title,
          audioUrl: a.audioUrl,
          durationSeconds: a.durationSeconds || 0,
          orderIndex: a.orderIndex || idx + 1,
          transcript: a.transcript || '',
        }));
      },
      error: () => {
        alert('Unable to load lesson details!');
      },
    });
  }

  onTitleChange(newTitle: string): void {
    this.lessonTitle.set(newTitle);
    if (!this.isEditing()) {
      const autoSlug = newTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      this.lessonSlug = autoSlug;
      if (!this.article.title) {
        this.article.title = newTitle;
      }
    }
  }

  addVocabulary(): void {
    this.vocabularies.push({
      word: '',
      definitionEn: '',
      exampleSentence: '',
      orderIndex: this.vocabularies.length + 1,
    });
  }

  removeVocabulary(index: number): void {
    this.vocabularies.splice(index, 1);
  }

  addAudio(): void {
    this.audios.push({
      audioType: 'MINI_STORY',
      title: 'Mini-Story ' + (this.audios.length + 1),
      audioUrl: '',
      durationSeconds: 300,
      orderIndex: this.audios.length + 1,
      transcript: '',
    });
  }

  removeAudio(index: number): void {
    this.audios.splice(index, 1);
  }

  switchTab(tab: StudioTab): void {
    if (this.activeTab() === 'article' && !this.isHtmlMode && this.editorContainer?.nativeElement) {
      this.article.content = this.editorContainer.nativeElement.innerHTML;
    }
    this.activeTab.set(tab);
    if (tab === 'article' && !this.isHtmlMode) {
      setTimeout(() => {
        if (this.editorContainer?.nativeElement) {
          this.editorContainer.nativeElement.innerHTML = this.article.content || '';
        }
      }, 0);
    }
  }

  setEditorMode(isHtml: boolean): void {
    if (this.isHtmlMode === isHtml) return;

    if (isHtml) {
      if (this.editorContainer?.nativeElement) {
        this.article.content = this.editorContainer.nativeElement.innerHTML;
      }
      this.isHtmlMode = true;
    } else {
      this.isHtmlMode = false;
      setTimeout(() => {
        if (this.editorContainer?.nativeElement) {
          this.editorContainer.nativeElement.innerHTML = this.article.content || '';
        }
      }, 0);
    }
  }

  onEditorInput(): void {
    if (this.editorContainer?.nativeElement) {
      this.article.content = this.editorContainer.nativeElement.innerHTML;
    }
  }

  execCmd(command: string, value: string | undefined = undefined): void {
    document.execCommand(command, false, value);
    this.onEditorInput();
  }

  execFormatBlock(tag: string): void {
    document.execCommand('formatBlock', false, tag);
    this.onEditorInput();
  }

  highlightVocabulary(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      alert('Please select a word or phrase before clicking Highlight Word!');
      return;
    }

    let node: Node | null = selection.anchorNode;
    let markElement: HTMLElement | null = null;
    while (node && node !== this.editorContainer?.nativeElement) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'MARK') {
        markElement = node as HTMLElement;
        break;
      }
      node = node.parentNode;
    }

    if (markElement) {
      const parent = markElement.parentNode;
      while (markElement.firstChild) {
        parent?.insertBefore(markElement.firstChild, markElement);
      }
      parent?.removeChild(markElement);
    } else {
      const selectedHtml = selection.toString();
      if (selectedHtml.trim()) {
        document.execCommand('insertHTML', false, `<mark class="vocab-highlight">${selectedHtml}</mark>`);
      }
    }

    this.onEditorInput();
  }

  getWordCount(content?: string): number {
    if (!content) return 0;
    const text = content.replace(/<[^>]*>/g, ' ').trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }

  onArticleAudioLoaded(event: Event): void {
    const audio = event.target as HTMLAudioElement;
    if (audio && audio.duration && !isNaN(audio.duration)) {
      this.article.durationSeconds = Math.round(audio.duration);
    }
  }

  onTrackAudioLoaded(track: AdminAudio, event: Event): void {
    const audio = event.target as HTMLAudioElement;
    if (audio && audio.duration && !isNaN(audio.duration)) {
      track.durationSeconds = Math.round(audio.duration);
    }
  }

  saveLesson(): void {
    if (this.activeTab() === 'article' && !this.isHtmlMode && this.editorContainer?.nativeElement) {
      this.article.content = this.editorContainer.nativeElement.innerHTML;
    }

    const title = this.lessonTitle().trim();
    if (!title) {
      alert('Please enter a lesson title');
      return;
    }

    this.isSaving.set(true);

    const payload: UpdateLessonDto = {
      title,
      slug: this.lessonSlug.trim() || undefined,
      description: this.description.trim() || undefined,
      orderIndex: Number(this.orderIndex) || 1,
      article: this.article.title?.trim() || this.article.audioUrl?.trim() || this.article.content?.trim()
        ? {
            title: this.article.title?.trim() || title,
            content: this.article.content?.trim() || '',
            audioUrl: this.article.audioUrl?.trim() || undefined,
            durationSeconds: Number(this.article.durationSeconds) || 0,
          }
        : undefined,
      vocabularies: this.vocabularies
        .filter((v) => v.word?.trim())
        .map((v, idx) => ({
          id: v.id || undefined,
          word: v.word.trim(),
          definitionEn: v.definitionEn?.trim() || undefined,
          exampleSentence: v.exampleSentence?.trim() || undefined,
          orderIndex: Number(v.orderIndex) || idx + 1,
        })),
      audios: this.audios
        .filter((a) => a.title?.trim() && a.audioUrl?.trim())
        .map((a, idx) => ({
          id: a.id || undefined,
          audioType: a.audioType,
          title: a.title.trim(),
          audioUrl: a.audioUrl.trim(),
          transcript: a.transcript?.trim() || undefined,
          durationSeconds: Number(a.durationSeconds) || 0,
          orderIndex: Number(a.orderIndex) || idx + 1,
        })),
    };

    const courseRef = this.courseSlug() || this.courseId();
    const lid = this.lessonId();
    if (this.isEditing() && lid) {
      // Update
      this.adminService.updateLesson(lid, payload, courseRef).subscribe({
        next: () => {
          this.isSaving.set(false);
          alert('Lesson updated successfully!');
          this.router.navigate(['/admin/courses', courseRef, 'lessons']);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          const msg = Array.isArray(err.error?.message)
            ? err.error.message.join(', ')
            : err.error?.message || err.message;
          alert('Update error: ' + msg);
        },
      });
    } else {
      // Create
      this.adminService.createLesson(courseRef, payload as CreateLessonDto).subscribe({
        next: () => {
          this.isSaving.set(false);
          alert('New lesson created successfully!');
          this.router.navigate(['/admin/courses', courseRef, 'lessons']);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          const msg = Array.isArray(err.error?.message)
            ? err.error.message.join(', ')
            : err.error?.message || err.message;
          alert('Creation error: ' + msg);
        },
      });
    }
  }
}