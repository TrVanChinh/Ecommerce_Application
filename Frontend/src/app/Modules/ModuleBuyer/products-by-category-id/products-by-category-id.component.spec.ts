import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsByCategoryIdComponent } from './products-by-category-id.component';

describe('ProductsByCategoryIdComponent', () => {
  let component: ProductsByCategoryIdComponent;
  let fixture: ComponentFixture<ProductsByCategoryIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsByCategoryIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsByCategoryIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
