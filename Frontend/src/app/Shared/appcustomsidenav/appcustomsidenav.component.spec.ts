import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppcustomsidenavComponent } from './appcustomsidenav.component';

describe('AppcustomsidenavComponent', () => {
  let component: AppcustomsidenavComponent;
  let fixture: ComponentFixture<AppcustomsidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppcustomsidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppcustomsidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
