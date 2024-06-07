import { TestBed } from '@angular/core/testing';

import { ShippingUnitService } from './shipping-unit.service';

describe('ShippingUnitService', () => {
  let service: ShippingUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
