import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDialogSelectComponent } from './address-dialog-select.component';

describe('AddressDialogSelectComponent', () => {
  let component: AddressDialogSelectComponent;
  let fixture: ComponentFixture<AddressDialogSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressDialogSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDialogSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
