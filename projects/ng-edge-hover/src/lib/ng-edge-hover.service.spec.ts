import { TestBed } from '@angular/core/testing';

import { NgEdgeHoverService } from './ng-edge-hover.service';

describe('NgEdgeHoverService', () => {
  let service: NgEdgeHoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgEdgeHoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
