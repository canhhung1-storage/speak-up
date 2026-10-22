import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';

interface Pillar {
  iconType: 'blue' | 'pink' | 'orange' | 'purple';
  iconSvg: string;
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
              <div class="pillar-icon-box" [ngClass]="'icon-' + pillar.iconType">
                <span [innerHTML]="pillar.iconSvg"></span>
              </div>
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

      .pillar-icon-box {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;

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
      iconType: 'blue',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
        </svg>
      `,
      title: 'Main Audio Article',
      description:
        'Listen to fascinating stories and articles. Improve your listening comprehension naturally.',
    },
    {
      iconType: 'pink',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
          <line x1="6" y1="2" x2="6" y2="4"></line>
          <line x1="10" y1="2" x2="10" y2="4"></line>
          <line x1="14" y1="2" x2="14" y2="4"></line>
        </svg>
      `,
      title: 'Vocabulary Lesson',
      description:
        'Learn words in context through audio explanations, never memorize lists again.',
    },
    {
      iconType: 'orange',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      `,
      title: 'Mini-Story (Q&A)',
      description:
        'The secret weapon. Answer fast-paced questions to train your brain to think in English.',
      featured: true, // viền active xanh nổi bật như hình mẫu
    },
    {
      iconType: 'purple',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
      `,
      title: 'Point of View Story',
      description:
        'Master English grammar instinctively by listening to the same story in different tenses.',
    },
  ];
}
