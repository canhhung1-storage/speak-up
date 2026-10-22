import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  template: `
    <section class="cta-banner-section">
      <div class="container">
        <div class="banner-box" appReveal direction="up">
          <!-- Top Pill Badge -->
          <div class="banner-badge">
            <span>GET STARTED TODAY</span>
          </div>

          <!-- Main Title -->
          <h2 class="banner-title">Ready to Speak English Effortlessly?</h2>

          <!-- Subtitle -->
          <p class="banner-subtitle">
            Join thousands of students who have achieved fluency through the Effortless English method. Learn with your ears, not your eyes.
          </p>

          <!-- White CTA Button -->
          <div class="banner-action">
            <a routerLink="/courses" class="btn-banner-white">
              Get Started Free <span class="btn-icon">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .cta-banner-section {
        padding: 40px 0 80px 0;
      }

      .banner-box {
        position: relative;
        overflow: hidden;
        background: radial-gradient(circle at 50% 0%, #064e3b 0%, #062f28 45%, #081a18 100%);
        border-radius: 28px;
        padding: 64px 32px;
        text-align: center;
        box-shadow: 0 20px 50px rgba(6, 78, 59, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.08);

        @media (max-width: 640px) {
          padding: 48px 20px;
          border-radius: 20px;
        }
      }

      .banner-badge {
        display: inline-block;
        padding: 5px 14px;
        border-radius: 9999px;
        font-size: 0.725rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #6ee7b7;
        background: rgba(110, 231, 183, 0.12);
        border: 1px solid rgba(110, 231, 183, 0.25);
        margin-bottom: 20px;
      }

      .banner-title {
        color: #ffffff;
        font-size: clamp(2rem, 3.8vw, 3rem);
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: -0.03em;
        max-width: 720px;
        margin: 0 auto 16px auto;
      }

      .banner-subtitle {
        color: #94a3b8;
        font-size: 1rem;
        line-height: 1.6;
        max-width: 620px;
        margin: 0 auto 36px auto;
      }

      .banner-action {
        display: flex;
        justify-content: center;
      }

      .btn-banner-white {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 28px;
        border-radius: 12px;
        font-size: 0.975rem;
        font-weight: 700;
        color: #0f172a;
        background: #ffffff;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        text-decoration: none;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
      }

      .btn-icon {
        font-size: 0.9rem;
      }
    `,
  ],
})
export class CtaBannerComponent {}
