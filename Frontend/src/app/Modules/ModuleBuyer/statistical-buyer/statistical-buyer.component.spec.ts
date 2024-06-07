import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalBuyerComponent } from './statistical-buyer.component';

describe('StatisticalBuyerComponent', () => {
  let component: StatisticalBuyerComponent;
  let fixture: ComponentFixture<StatisticalBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticalBuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticalBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
