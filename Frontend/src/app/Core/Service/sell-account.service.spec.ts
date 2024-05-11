import { TestBed } from '@angular/core/testing';

import { SellAccountService } from './sell-account.service';

describe('SellAccountService', () => {
  let service: SellAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
