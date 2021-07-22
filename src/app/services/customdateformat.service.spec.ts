import { TestBed } from '@angular/core/testing';

import { CustomdateformatService } from './customdateformat.service';

describe('CustomdateformatService', () => {
  let service: CustomdateformatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomdateformatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
