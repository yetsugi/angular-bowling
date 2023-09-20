import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoresInputComponent } from './components/scores-input/scores-input.component';
import { ScoresCalculatorService } from './services/scores-calculator.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ScoresInputComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private readonly scoresCalculatorService = inject(ScoresCalculatorService);
  playersScores$ = this.scoresCalculatorService.playersScores;

  handleScoresInput(event: Event): void {
    const files = (event.target as HTMLInputElement).files!;

    if (files.length !== 0) {
      this.scoresCalculatorService.calculateScores(files[0]);
    } else {
      this.scoresCalculatorService.clearScores();
    }

    console.log((event.target as HTMLInputElement).files);
  }
}
