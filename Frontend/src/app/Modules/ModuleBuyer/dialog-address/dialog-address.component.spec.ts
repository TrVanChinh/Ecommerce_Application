import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddressComponent } from './dialog-address.component';

describe('DialogAddressComponent', () => {
  let component: DialogAddressComponent;
  let fixture: ComponentFixture<DialogAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
