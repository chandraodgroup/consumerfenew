import { TestBed } from '@angular/core/testing';

import { BookticketService } from './bookticket.service';

describe('BookticketService', () => {
  let service: BookticketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookticketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
