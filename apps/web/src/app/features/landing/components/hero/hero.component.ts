import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  template: `
    <section class="hero-section">
      <div class="container hero-container">
        <!-- Left Content -->
        <div class="hero-content" appReveal>
          <!-- Pill Badge -->
          <div class="pill-badge">
            <span>Master English Naturally</span>
            <span class="badge-icon">🚀</span>
          </div>

          <!-- Main Title -->
          <h1 class="hero-title">
            Stop Studying<br />
            Grammar.<br />
            Start <span class="gradient-speaking">Speaking</span> English.
          </h1>

          <!-- Subtitle -->
          <p class="hero-subtitle">
            Join thousands of students who have achieved fluency through the Effortless English method. Learn with your ears, not your eyes.
          </p>

          <!-- Action Buttons -->
          <div class="hero-actions">
            <a routerLink="/login" class="btn btn-primary">
              Start Learning Free <span class="btn-icon">→</span>
            </a>
            <a href="#how-it-works" class="btn btn-secondary">
              <span class="play-icon">▶</span> Watch Demo
            </a>
          </div>
        </div>

        <!-- Right Floating Audio Player Mockup -->
        <div class="hero-visual" appReveal direction="left" [delay]="150">
          <div class="audio-player-card">
            <!-- Card Header -->
            <div class="card-header">
              <div class="story-thumb">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
              </div>
              <div class="story-meta">
                <h4 class="story-title">Dragons (Mini-Story)</h4>
                <span class="story-author">A.J. Hoge</span>
              </div>
            </div>

            <!-- Transcript Snippet -->
            <div class="transcript-snippet">
              <p class="transcript-line text-muted">There was a beautiful princess.</p>
              <p class="transcript-line highlight-box">
                She lived in a very tall tower.
              </p>
              <p class="transcript-line text-muted">One day, a dragon came...</p>
            </div>

            <!-- Audio Progress Bar -->
            <div class="audio-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 48%"></div>
              </div>
            </div>

            <!-- Audio Controller Buttons -->
            <div class="audio-controls">
              <button class="ctrl-btn" aria-label="Previous track" title="Previous">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="19 20 9 12 19 4 19 20"></polygon>
                  <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2"></line>
                </svg>
              </button>
              <button class="ctrl-btn play-pause-btn" aria-label="Play or pause" title="Pause">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              </button>
              <button class="ctrl-btn" aria-label="Next track" title="Next">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-section {
        padding: calc(68px + 48px) 0 64px 0;
        overflow: hidden;
      }

      .hero-container {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        align-items: center;
        gap: 48px;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          gap: 40px;
          text-align: center;
        }
      }

      .hero-content {
        max-width: 580px;

        @media (max-width: 900px) {
          margin: 0 auto;
        }
      }

      .pill-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 0.825rem;
        font-weight: 600;
        color: var(--badge-text);
        background: var(--badge-bg);
        border: 1px solid var(--badge-border);
        margin-bottom: 24px;
      }

      .hero-title {
        font-size: clamp(2.4rem, 4.5vw, 3.8rem);
        font-weight: 800;
        line-height: 1.12;
        letter-spacing: -0.035em;
        margin-bottom: 20px;
      }

      .hero-subtitle {
        font-size: 1.05rem;
        line-height: 1.6;
        color: var(--text-secondary);
        margin-bottom: 32px;
      }

      .hero-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;

        @media (max-width: 900px) {
          justify-content: center;
        }
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: 12px;
        font-size: 0.95rem;
        font-weight: 600;
        transition: all 0.25s ease;
        text-decoration: none;
      }

      .btn-primary {
        background: #3b82f6;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);

        &:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(59, 130, 246, 0.4);
        }
      }

      .btn-secondary {
        background: var(--btn-secondary-bg);
        color: var(--btn-secondary-text);
        border: 1px solid var(--btn-secondary-border);

        &:hover {
          background: var(--btn-secondary-hover);
          transform: translateY(-2px);
        }
      }

      .play-icon {
        font-size: 0.75rem;
      }

      // --- Floating Player Card Styling ---
      .hero-visual {
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
      }

      .audio-player-card {
        width: 100%;
        max-width: 380px;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 24px;
        box-shadow: var(--card-shadow-hover);
        animation: floatCard 6s ease-in-out infinite;
        transition: background-color 0.25s ease, border-color 0.25s ease;
      }

      @keyframes floatCard {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
      }

      .story-thumb {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
      }

      .story-title {
        font-size: 0.975rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 2px;
      }

      .story-author {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .transcript-snippet {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
        font-size: 0.875rem;
      }

      .transcript-line {
        line-height: 1.5;
      }

      .highlight-box {
        background: var(--highlight-bg);
        color: var(--highlight-text);
        padding: 4px 8px;
        border-radius: 6px;
        font-weight: 600;
        display: inline-block;
      }

      .audio-progress {
        margin-bottom: 18px;
      }

      .progress-bar {
        height: 4px;
        background: var(--border-color);
        border-radius: 9999px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: #3b82f6;
        border-radius: 9999px;
      }

      .audio-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
      }

      .ctrl-btn {
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease, transform 0.2s ease;

        &:hover {
          color: var(--text-primary);
          transform: scale(1.1);
        }
      }

      .play-pause-btn {
        color: var(--text-primary);
      }
    `,
  ],
})
export class HeroComponent {}
