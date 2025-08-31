import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core'
import {prepareEnterExit} from './shared';

export type EnterSide = 'top' | 'right' | 'bottom' | 'left'

@Directive({
  selector: '[detectEnterSide]',
  standalone: true,
})
export class DetectEnterSideDirective {
  @Input() detectEnterSideTolerance = 8
  @Output() enterSide = new EventEmitter<EnterSide>()

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    const side = getEnterSide(event, this.el.nativeElement, this.detectEnterSideTolerance)
    this.enterSide.emit(side)
  }
}

function getEnterSide(event: MouseEvent, element: HTMLElement, tolerance = 0): EnterSide {
  const { dTop, dRight, dBottom, dLeft, rect, x, y } = prepareEnterExit(event, element)

  // Optional: ensure the point is within (or near) the element box
  const within =
    x >= rect.left - tolerance &&
    x <= rect.right + tolerance &&
    y >= rect.top - tolerance &&
    y <= rect.bottom + tolerance

  if (!within) {
    // Still pick the nearest edge for robustness
  }

  const min = Math.min(dTop, dRight, dBottom, dLeft)
  if (min === dTop) return 'top'
  if (min === dRight) return 'right'
  if (min === dBottom) return 'bottom'
  return 'left'
}
