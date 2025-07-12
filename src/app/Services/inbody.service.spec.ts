import { TestBed } from '@angular/core/testing';

import { InbodyService } from './inbody.service';

describe('InbodyService', () => {
  let service: InbodyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InbodyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
