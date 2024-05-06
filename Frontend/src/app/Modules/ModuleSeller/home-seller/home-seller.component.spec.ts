import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSellerComponent } from './home-seller.component';

describe('HomeSellerComponent', () => {
  let component: HomeSellerComponent;
  let fixture: ComponentFixture<HomeSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSellerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
