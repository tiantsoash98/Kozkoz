import { TestBed, inject } from '@angular/core/testing';

import { RecuperationService } from './recuperation.service';

describe('RecuperationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecuperationService]
    });
  });

  it('should be created', inject([RecuperationService], (service: RecuperationService) => {
    expect(service).toBeTruthy();
  }));
});
