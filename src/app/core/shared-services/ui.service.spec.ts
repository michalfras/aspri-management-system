import { TestBed } from '@angular/core/testing';

import { UiService } from './ui.service';

describe('NavigationService', () => {
  let service: UiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
