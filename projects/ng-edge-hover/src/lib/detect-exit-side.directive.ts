import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import {prepareEnterExit} from './shared';

export type ExitSide = 'top' | 'right' | 'bottom' | 'left';

@Directive({
  selector: '[detectExitSide]',
  standalone: true,
})
export class DetectExitSideDirective {
  @Input() detectExitSideTolerance = 8;
  @Output() exitSide = new EventEmitter<ExitSide>();

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    const side = getExitSide(event, this.el.nativeElement, this.detectExitSideTolerance);
    this.exitSide.emit(side);
  }
}

function getExitSide(event: MouseEvent, element: HTMLElement, tolerance = 0): ExitSide {
  const { dTop, dRight, dBottom, dLeft, rect, x, y } = prepareEnterExit(event, element)

  // Heuristic checks to bias toward the direction actually left
  const toTop = y <= rect.top + tolerance;
  const toRight = x >= rect.right - tolerance;
  const toBottom = y >= rect.bottom - tolerance;
  const toLeft = x <= rect.left + tolerance;

  // If one of the edges clearly matches, use it
  if (toTop && !toRight && !toLeft) return 'top';
  if (toRight && !toTop && !toBottom) return 'right';
  if (toBottom && !toRight && !toLeft) return 'bottom';
  if (toLeft && !toTop && !toBottom) return 'left';

  // Otherwise, pick the nearest edge as a fallback
  const min = Math.min(dTop, dRight, dBottom, dLeft);
  if (min === dTop) return 'top';
  if (min === dRight) return 'right';
  if (min === dBottom) return 'bottom';
  return 'left';
}
