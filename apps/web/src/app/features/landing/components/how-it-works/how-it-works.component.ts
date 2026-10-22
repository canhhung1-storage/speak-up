import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';

interface Step {
  stepNumber: string;
  iconType: 'blue' | 'pink' | 'orange' | 'purple';
  iconSvg: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section id="how-it-works" class="how-it-works-section">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header" appReveal>
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">
            Follow our proven 4-step daily study roadmap to achieve confident spoken English.
          </p>
        </div>

        <!-- 4 Step Cards Grid -->
        <div class="steps-grid">
          @for (step of steps; track step.stepNumber; let i = $index) {
            <div class="step-card" appReveal [delay]="i * 120">
              <!-- Top Header with Icon and Big Watermark Number -->
              <div class="step-card-header">
                <div class="step-icon-box" [ngClass]="'icon-' + step.iconType">
                  <span [innerHTML]="step.iconSvg"></span>
                </div>
                <span class="step-watermark">{{ step.stepNumber }}</span>
              </div>

              <!-- Content -->
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .how-it-works-section {
        padding: 56px 0 80px 0;
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

      .steps-grid {
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

      .step-card {
        position: relative;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 18px;
        padding: 28px 24px;
        box-shadow: var(--card-shadow);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        display: flex;
        flex-direction: column;

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--card-shadow-hover);
        }
      }

      .step-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }

      .step-icon-box {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;

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

      .step-watermark {
        font-size: 2.5rem;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.04em;
        color: #e2e8f0;
        user-select: none;
        transition: color 0.25s ease;
      }

      :host-context(html[data-theme='dark']) .step-watermark {
        color: rgba(255, 255, 255, 0.08);
      }

      .step-title {
        font-size: 1.05rem;
        font-weight: 700;
        margin-bottom: 12px;
      }

      .step-desc {
        font-size: 0.875rem;
        line-height: 1.55;
        color: var(--text-secondary);
      }
    `,
  ],
})
export class HowItWorksComponent {
  readonly steps: Step[] = [
    {
      stepNumber: '01',
      iconType: 'blue',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      `,
      title: 'Listen & Read',
      description:
        'Listen to the Main Audio while reading the transcript. Understand the story and lookup new words in context.',
    },
    {
      stepNumber: '02',
      iconType: 'pink',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
        </svg>
      `,
      title: 'Understand Deeply',
      description:
        'Listen to the Vocabulary Lesson. Understand new words deeply through English explanations, not translation.',
    },
    {
      stepNumber: '03',
      iconType: 'orange',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
        </svg>
      `,
      title: 'Answer & Respond',
      description:
        'Listen to the Mini-Story. AJ Hoge asks easy questions rapidly; you must shout out the answers immediately.',
    },
    {
      stepNumber: '04',
      iconType: 'purple',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
      `,
      title: 'Master Grammar',
      description:
        'Listen to Point of View stories. Experience grammar tenses changing naturally without studying rules.',
    },
  ];
}
