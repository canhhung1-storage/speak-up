import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';

interface Pillar {
  number: string;
  iconType: 'blue' | 'pink' | 'orange' | 'purple';
  title: string;
  description: string;
  featured?: boolean;
}

@Component({
  selector: 'app-pillars',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section id="pillars" class="pillars-section">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header" appReveal>
          <h2 class="section-title">The 4 Pillars of Fluency</h2>
          <p class="section-subtitle">
            Follow our proven roadmap to achieve confident spoken English.
          </p>
        </div>

        <!-- 4 Pillars Grid -->
        <div class="pillars-grid">
          @for (pillar of pillars; track pillar.title; let i = $index) {
            <div
              class="pillar-card"
              [class.is-featured]="pillar.featured"
              appReveal
              [delay]="i * 120"
            >
              <!-- Card Header with Icon Box and Big Watermark Number -->
              <div class="pillar-card-header">
                <div class="pillar-icon-box" [ngClass]="'icon-' + pillar.iconType">
                  @switch (pillar.iconType) {
                    @case ('blue') {
                      <!-- Headphones for Listening -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
                        <path d="M21 12a9 9 0 0 0-18 0"></path>
                      </svg>
                    }
                    @case ('pink') {
                      <!-- Book for Vocabulary -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                        <path d="M8 7h8"></path>
                        <path d="M8 11h8"></path>
                        <path d="M8 15h5"></path>
                      </svg>
                    }
                    @case ('orange') {
                      <!-- Zap for Speaking Reflex -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    }
                    @case ('purple') {
                      <!-- Clock / Timeline for Grammar Tenses -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                        <path d="M12 7v5l4 2"></path>
                      </svg>
                    }
                  }
                </div>
                <span class="pillar-watermark">{{ pillar.number }}</span>
              </div>

              <!-- Content -->
              <h3 class="pillar-title">{{ pillar.title }}</h3>
              <p class="pillar-desc">{{ pillar.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .pillars-section {
        padding: 64px 0 72px 0;
      }

      .section-header {
        text-align: center;
        max-width: 600px;
        margin: 0 auto 48px auto;
      }

      .section-title {
        font-size: clamp(1.8rem, 3.2vw, 2.4rem);
        font-weight: 800;
        margin-bottom: 12px;
      }

      .section-subtitle {
        font-size: 0.975rem;
        color: var(--text-secondary);
      }

      .pillars-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;

        @media (max-width: 1024px) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 600px) {
          grid-template-columns: 1fr;
        }
      }

      .pillar-card {
        position: relative;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 18px;
        padding: 28px 24px;
        box-shadow: var(--card-shadow);
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        display: flex;
        flex-direction: column;

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--card-shadow-hover);
        }

        &.is-featured {
          border: 2px solid var(--border-active);
          box-shadow: 0 10px 28px rgba(59, 130, 246, 0.12);
        }
      }

      .pillar-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }

      .pillar-icon-box {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        svg {
          display: block;
        }

        &.icon-blue {
          background: #eff6ff;
          color: #3b82f6;
        }

        &.icon-pink {
          background: #fdf2f8;
          color: #ec4899;
        }

        &.icon-orange {
          background: #fff7ed;
          color: #f97316;
        }

        &.icon-purple {
          background: #f5f3ff;
          color: #8b5cf6;
        }
      }

      :host-context(html[data-theme='dark']) {
        .pillar-icon-box.icon-blue {
          background: rgba(59, 130, 246, 0.15);
        }
        .pillar-icon-box.icon-pink {
          background: rgba(236, 72, 153, 0.15);
        }
        .pillar-icon-box.icon-orange {
          background: rgba(249, 115, 22, 0.15);
        }
        .pillar-icon-box.icon-purple {
          background: rgba(139, 92, 246, 0.15);
        }
      }

      .pillar-watermark {
        font-size: 2.5rem;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.04em;
        color: #e2e8f0;
        user-select: none;
        transition: color 0.25s ease;
      }

      :host-context(html[data-theme='dark']) .pillar-watermark {
        color: rgba(255, 255, 255, 0.08);
      }

      .pillar-title {
        font-size: 1.05rem;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .pillar-desc {
        font-size: 0.875rem;
        line-height: 1.55;
        color: var(--text-secondary);
      }
    `,
  ],
})
export class PillarsComponent {
  readonly pillars: Pillar[] = [
    {
      number: '01',
      iconType: 'blue',
      title: 'Main Audio Article',
      description:
        'Listen to fascinating stories and articles. Improve your listening comprehension naturally.',
    },
    {
      number: '02',
      iconType: 'pink',
      title: 'Vocabulary Lesson',
      description:
        'Learn words in context through audio explanations, never memorize lists again.',
    },
    {
      number: '03',
      iconType: 'orange',
      title: 'Mini-Story (Q&A)',
      description:
        'The secret weapon. Answer fast-paced questions to train your brain to think in English.',
      featured: true,
    },
    {
      number: '04',
      iconType: 'purple',
      title: 'Point of View Story',
      description:
        'Master English grammar instinctively by listening to the same story in different tenses.',
    },
  ];
}
