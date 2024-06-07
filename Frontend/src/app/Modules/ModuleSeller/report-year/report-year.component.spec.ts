import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportYearComponent } from './report-year.component';

describe('ReportYearComponent', () => {
  let component: ReportYearComponent;
  let fixture: ComponentFixture<ReportYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
