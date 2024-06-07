import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueByCustomerComponent } from './revenue-by-customer.component';

describe('RevenueByCustomerComponent', () => {
  let component: RevenueByCustomerComponent;
  let fixture: ComponentFixture<RevenueByCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueByCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueByCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
