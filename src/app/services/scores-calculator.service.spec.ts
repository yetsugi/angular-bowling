import { TestBed } from '@angular/core/testing';

import { ScoresCalculatorService } from './scores-calculator.service';

describe('ScoresCalculatorService', () => {
  let service: ScoresCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoresCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
