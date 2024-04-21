import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCustomSidenavComponent } from './app-custom-sidenav.component';

describe('AppCustomSidenavComponent', () => {
  let component: AppCustomSidenavComponent;
  let fixture: ComponentFixture<AppCustomSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppCustomSidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCustomSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
