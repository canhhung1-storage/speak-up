import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .app-main {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class AppComponent {
  title = 'SpeakUp';
}
