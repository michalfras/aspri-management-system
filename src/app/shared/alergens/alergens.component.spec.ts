import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlergensComponent } from './alergens.component';

describe('AlergensComponent', () => {
  let component: AlergensComponent;
  let fixture: ComponentFixture<AlergensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlergensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlergensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
