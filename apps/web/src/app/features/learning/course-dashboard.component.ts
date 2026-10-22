import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <h2>Courses & Learning Dashboard</h2>
      <p>Course list and lessons view will be rendered here.</p>
      <a routerLink="/" class="back-link">← Back to Landing Page</a>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 48px 24px;
        max-width: 1000px;
        margin: 0 auto;
        text-align: center;
      }
      .back-link {
        display: inline-block;
        margin-top: 24px;
        color: #818cf8;
      }
    `,
  ],
})
export class CourseDashboardComponent {}
