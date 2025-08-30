import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';

type HoverHoldSide = 'left' | 'right';

@Directive({
  selector: 'button[hoverHoldClick]',
  standalone: true,
})
export class HoverHoldClickDirective {
  // Percentage width of the button that acts as the hover zone (default 25%)
  @Input() hoverHoldPercent = 25;
  // How long the pointer must stay in the zone to trigger the click (default 250ms)
  @Input() hoverHoldDelayMs = 250;
  // Which side the zone is anchored to (default left)
  @Input() hoverHoldSide: HoverHoldSide = 'left';

  private hoverTimer: ReturnType<typeof setTimeout> | null = null;
  private insideZone = false;
  private firedForCurrentHover = false;

  constructor(private el: ElementRef<HTMLButtonElement>, private ngZone: NgZone) {}

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    if (this.isDisabled()) return;
    this.firedForCurrentHover = false;
    this.handlePointer(event);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDisabled()) {
      this.resetState();
      return;
    }
    this.handlePointer(event);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.resetState();
  }

  private handlePointer(event: MouseEvent) {
    const inZone = this.isInHoverZone(event);
    if (inZone) {
      this.insideZone = true;
      this.ensureTimer();
    } else {
      this.insideZone = false;
      this.clearTimer();
    }
  }

  private ensureTimer() {
    if (this.hoverTimer || this.firedForCurrentHover) return;
    const delay = Math.max(0, this.hoverHoldDelayMs | 0);
    this.hoverTimer = setTimeout(() => {
      this.hoverTimer = null;
      if (this.insideZone && !this.isDisabled() && !this.firedForCurrentHover) {
        this.firedForCurrentHover = true;
        this.triggerClick();
      }
    }, delay);
  }

  private clearTimer() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  private resetState() {
    this.clearTimer();
    this.insideZone = false;
    this.firedForCurrentHover = false;
  }

  private isInHoverZone(event: MouseEvent): boolean {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX;

    // Clamp percent to [0, 100]
    const pct = Math.max(0, Math.min(100, Number(this.hoverHoldPercent) || 0));
    if (pct <= 0) return false;

    const zoneWidth = (rect.width * pct) / 100;

    if (this.hoverHoldSide === 'right') {
      const zoneStart = rect.right - zoneWidth;
      return x >= zoneStart && x <= rect.right;
    }

    // default: left
    const zoneEnd = rect.left + zoneWidth;
    return x >= rect.left && x <= zoneEnd;
  }

  private triggerClick() {
    // Ensure Angular change detection runs for any (click) handlers
    this.ngZone.run(() => {
      this.el.nativeElement.click();
    });
  }

  private isDisabled(): boolean {
    const el = this.el.nativeElement;
    return el.hasAttribute('disabled') || el.disabled;
  }
}
