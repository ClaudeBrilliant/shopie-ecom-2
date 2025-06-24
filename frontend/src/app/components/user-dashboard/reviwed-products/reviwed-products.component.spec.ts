import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviwedProductsComponent } from './reviwed-products.component';

describe('ReviwedProductsComponent', () => {
  let component: ReviwedProductsComponent;
  let fixture: ComponentFixture<ReviwedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviwedProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviwedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
