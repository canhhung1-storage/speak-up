import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { PillarsComponent } from './components/pillars/pillars.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { CtaBannerComponent } from './components/cta-banner/cta-banner.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    PillarsComponent,
    HowItWorksComponent,
    CtaBannerComponent,
    FooterComponent,
  ],
  template: `
    <div class="landing-page-layout">
      <!-- 1. Sticky Navigation Bar with Dark/Light Toggle -->
      <app-navbar></app-navbar>

      <!-- Main Content -->
      <main>
        <!-- 2. Hero Section with Floating Audio Player -->
        <app-hero></app-hero>

        <!-- 3. The 4 Pillars of Fluency -->
        <app-pillars></app-pillars>

        <!-- 4. How It Works - 4 Step Daily Study Roadmap -->
        <app-how-it-works></app-how-it-works>

        <!-- 5. Bottom Dark Radial CTA Banner -->
        <app-cta-banner></app-cta-banner>
      </main>

      <!-- 6. Footer -->
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      .landing-page-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      main {
        flex: 1;
      }
    `,
  ],
})
export class LandingPageComponent {}
