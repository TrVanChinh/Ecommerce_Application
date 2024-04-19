import { TestBed } from '@angular/core/testing';

import { AdminManagerService } from './admin-manager.service';

describe('AdminManagerService', () => {
  let service: AdminManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
