import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoresInputComponent } from './components/scores-input/scores-input.component';
import { ScoresCalculatingService } from './services/scores-calculating.service';
import { ScoresTableComponent } from './components/scores-table/scores-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ScoresInputComponent, ScoresTableComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly scoresCalculatingService = inject(ScoresCalculatingService);

  players$ = this.scoresCalculatingService.players;
  parseErrorMsg$ = this.scoresCalculatingService.parseErrorMsg;

  handleScoresInput(event: Event): void {
    const files = (event.target as HTMLInputElement).files!;

    if (files.length !== 0) {
      this.scoresCalculatingService.calculateScores(files[0]);
    } else {
      this.scoresCalculatingService.clearScores();
      this.scoresCalculatingService.clearErrorMsg();
    }
  }
}
