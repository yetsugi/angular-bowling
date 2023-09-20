import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoresInputComponent } from './scores-input.component';

describe('ScoresInputComponent', () => {
  let component: ScoresInputComponent;
  let fixture: ComponentFixture<ScoresInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ScoresInputComponent]
    });
    fixture = TestBed.createComponent(ScoresInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
