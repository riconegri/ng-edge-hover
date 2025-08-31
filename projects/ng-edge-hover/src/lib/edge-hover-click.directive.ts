import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';

@Directive({
  selector: 'button[edgeHoverClick]',
  standalone: true,
})
export class EdgeHoverClickDirective {
  // Pixels of leeway around edges to account for rounding/jitter
  @Input() edgeHoverClickTolerance = 8;

  private enteredFromTop = false;

  constructor(private el: ElementRef<HTMLElement>, private ngZone: NgZone) {}

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY
    const tol = this.edgeHoverClickTolerance

    const withinHorizontal = x >= rect.left - tol && x <= rect.right + tol
    const fromTop = y <= rect.top + tol

    this.enteredFromTop = withinHorizontal && fromTop
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY
    const tol = this.edgeHoverClickTolerance

    const withinVertical = y >= rect.top - tol && y <= rect.bottom + tol;
    // When leaving to the right, pointer typically reports > rect.right
    const toRight = x >= rect.right - 1 // small fudge so very edge cases still count

    if (this.enteredFromTop && withinVertical && toRight && !this.isDisabled()) {
      this.triggerClick()
    }

    // Reset sequence state on every leave
    this.enteredFromTop = false;
  }

  private triggerClick() {
    // Ensure Angular change detection runs for any (click) handlers
    this.ngZone.run(() => {
      this.el.nativeElement.click()
    });
  }

  private isDisabled(): boolean {
    const el = this.el.nativeElement as HTMLButtonElement
    return el.hasAttribute('disabled') || (el as HTMLButtonElement).disabled
  }
}
