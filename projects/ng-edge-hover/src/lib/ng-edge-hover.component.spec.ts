import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgEdgeHoverComponent } from './ng-edge-hover.component';

describe('NgEdgeHoverComponent', () => {
  let component: NgEdgeHoverComponent;
  let fixture: ComponentFixture<NgEdgeHoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgEdgeHoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgEdgeHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
