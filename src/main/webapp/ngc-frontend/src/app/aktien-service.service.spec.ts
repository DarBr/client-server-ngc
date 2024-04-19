import { TestBed } from '@angular/core/testing';

import { AktienServiceService } from './aktien-service.service';

describe('AktienServiceService', () => {
  let service: AktienServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AktienServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
