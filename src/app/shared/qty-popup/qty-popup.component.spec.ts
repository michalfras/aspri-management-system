import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QtyPopupComponent } from './qty-popup.component';

describe('QtyPopupComponent', () => {
  let component: QtyPopupComponent;
  let fixture: ComponentFixture<QtyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QtyPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QtyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
