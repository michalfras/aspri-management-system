import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageFlagsComponent } from './language-flags.component';

describe('LanguageFlagsComponent', () => {
  let component: LanguageFlagsComponent;
  let fixture: ComponentFixture<LanguageFlagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageFlagsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
