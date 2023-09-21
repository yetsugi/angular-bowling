import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-scores-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scores-table.component.html',
  styleUrls: ['./scores-table.component.css'],
})
export class ScoresTableComponent {
  @Input()
  players!: Player[];

  readonly rounds = Array(10)
    .fill(0)
    .map((v, i) => i + 1);
}
