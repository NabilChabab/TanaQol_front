import { TestBed } from '@angular/core/testing';

import { LatestCompetitionsService } from './latest-competitions.service';

describe('LatestCompetitionsService', () => {
  let service: LatestCompetitionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LatestCompetitionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
