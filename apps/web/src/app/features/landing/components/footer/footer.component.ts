import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer-wrapper">
      <div class="container footer-container">
        <!-- Logo -->
        <a routerLink="/" class="footer-logo">
          <span class="logo-text">Speak<span class="logo-accent">Up</span></span>
        </a>

        <!-- Tagline -->
        <p class="footer-tagline">
          Stop Studying Grammar. Start Speaking English.
        </p>

        <!-- Copyright -->
        <p class="footer-copyright">
          &copy; 2026 SpeakUp. All rights reserved. Built with the Effortless English method in mind.
        </p>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer-wrapper {
        border-top: 1px solid var(--border-color);
        padding: 48px 0 56px 0;
        background: var(--bg-main);
        text-align: center;
        transition: border-color 0.25s ease;
      }

      .footer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .footer-logo {
        text-decoration: none;
      }

      .logo-text {
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--text-primary);
      }

      .logo-accent {
        color: #3b82f6;
      }

      .footer-tagline {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-secondary);
      }

      .footer-copyright {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    `,
  ],
})
export class FooterComponent {}
