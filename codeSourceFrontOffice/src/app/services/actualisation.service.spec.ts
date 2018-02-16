import { TestBed, inject } from '@angular/core/testing';

import { ActualisationService } from './actualisation.service';

describe('ActualisationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActualisationService]
    });
  });

  it('should be created', inject([ActualisationService], (service: ActualisationService) => {
    expect(service).toBeTruthy();
  }));
});
