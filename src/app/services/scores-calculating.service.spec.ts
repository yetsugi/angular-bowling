import { TestBed } from '@angular/core/testing';

import { ScoresCalculatingService } from './scores-calculating.service';

describe('ScoresCalculatorService', () => {
  let service: ScoresCalculatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoresCalculatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
