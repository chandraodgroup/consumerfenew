import { TestBed } from '@angular/core/testing';

import { PaymentstatusService } from './paymentstatus.service';

describe('PaymentstatusService', () => {
  let service: PaymentstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
