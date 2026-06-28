import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffMenuComponent } from './staff-menu.component';

describe('StaffMenuComponent', () => {
  let component: StaffMenuComponent;
  let fixture: ComponentFixture<StaffMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
