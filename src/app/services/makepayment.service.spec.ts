import { TestBed } from '@angular/core/testing';

import { MakepaymentService } from './makepayment.service';

describe('MakepaymentService', () => {
  let service: MakepaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakepaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
