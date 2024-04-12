import { TestBed } from '@angular/core/testing';

import { TransaktionService } from './transaktion.service';

describe('TransaktionService', () => {
  let service: TransaktionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransaktionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
