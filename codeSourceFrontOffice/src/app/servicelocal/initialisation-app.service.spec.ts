import { TestBed, inject } from '@angular/core/testing';

import { InitialisationAppService } from './initialisation-app.service';

describe('InitialisationAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitialisationAppService]
    });
  });

  it('should be created', inject([InitialisationAppService], (service: InitialisationAppService) => {
    expect(service).toBeTruthy();
  }));
});
