# ng-edge-hover

Edge-aware hover gesture directives for Angular.

- edgeHoverClick: enter from top, exit right => click
- edgeHoverTopExitTopClick: enter from top, exit top => click
- hoverHoldClick: hover in a zone (e.g., left 25%) for a duration => click

## Install
npm i ng-edge-hover

## Usage (standalone components)
```ts
import { Component } from '@angular/core';
import { EdgeHoverClickDirective, EdgeHoverTopExitTopClickDirective, HoverHoldClickDirective } from 'ng-edge-hover';

@Component({
  standalone: true,
  selector: 'app-demo',
  imports: [],
  template: `
    <button edgeHoverClick (click)="log('edge top->right')">Edge Top->Right</button>
    <button edgeHoverTopExitTopClick (click)="log('edge top->top')">Edge Top->Top</button>
    <button hoverHoldClick [hoverHoldPercent]="25" [hoverHoldDelayMs]="250" (click)="log('hover hold')"> Hover left 25% for 250ms </button>
     `}) 
export class DemoComponent { 
  log(m: string) { console.log(m); }
}
```
## Awaiting

- Tests
- Optimization
