import { TestBed, inject } from '@angular/core/testing';

import { ApilifxService } from './apilifx.service';

describe('ApilifxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApilifxService]
    });
  });

  it('should be created', inject([ApilifxService], (service: ApilifxService) => {
    expect(service).toBeTruthy();
  }));
});
