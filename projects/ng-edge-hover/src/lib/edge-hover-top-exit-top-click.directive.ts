import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';

@Directive({
  selector: 'button[edgeHoverTopExitTopClick]',
  standalone: true,
})
export class EdgeHoverTopExitTopClickDirective {
  // Pixels of leeway around edges to account for rounding/jitters
  @Input() edgeHoverClickTolerance = 8;

  private enteredFromTop = false;

  constructor(private el: ElementRef<HTMLElement>, private ngZone: NgZone) {}

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    const tol = this.edgeHoverClickTolerance;

    const withinHorizontal = x >= rect.left - tol && x <= rect.right + tol;
    const fromTop = y <= rect.top + tol;

    this.enteredFromTop = withinHorizontal && fromTop;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    const tol = this.edgeHoverClickTolerance;

    const withinHorizontal = x >= rect.left - tol && x <= rect.right + tol;
    // When leaving to the top, pointer typically reports < rect.top
    const toTop = y <= rect.top + 1; // small fudge to include very edge cases

    if (this.enteredFromTop && withinHorizontal && toTop && !this.isDisabled()) {
      this.triggerClick();
    }

    // Reset sequence state on every leave
    this.enteredFromTop = false;
  }

  private triggerClick() {
    // Ensure Angular change detection runs for any (click) handlers
    this.ngZone.run(() => {
      this.el.nativeElement.click();
    });
  }

  private isDisabled(): boolean {
    const el = this.el.nativeElement as HTMLButtonElement;
    return el.hasAttribute('disabled') || el.disabled;
  }
}
