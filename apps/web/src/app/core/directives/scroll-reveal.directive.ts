import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  inject,
} from '@angular/core';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() delay = 0; // ms delay for staggered effects
  @Input() direction: RevealDirection = 'up';

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const nativeEl = this.el.nativeElement;

    // Thiết lập trạng thái ban đầu ẩn và dịch chuyển
    this.renderer.addClass(nativeEl, 'reveal-init');
    this.renderer.addClass(nativeEl, `reveal-${this.direction}`);

    if (this.delay > 0) {
      this.renderer.setStyle(nativeEl, 'transition-delay', `${this.delay}ms`);
    }

    // Lắng nghe khi phần tử cuộn vào viewport
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(nativeEl, 'is-revealed');
            this.observer?.unobserve(nativeEl);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    this.observer.observe(nativeEl);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
