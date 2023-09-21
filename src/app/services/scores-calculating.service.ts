import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/player';
import { Round } from '../models/round';

@Injectable({
  providedIn: 'root',
})
export class ScoresCalculatingService {
  players = new BehaviorSubject<Player[] | null>(null);

  private readonly fileReader = new FileReader();

  constructor() {
    this.fileReader.onload = this.loadFile;
  }

  calculateScores(scoresFile: File): void {
    this.clearScores();

    this.fileReader.readAsText(scoresFile);
  }

  clearScores(): void {
    this.players.next(null);
  }

  private loadFile = (): void => {
    const result = (this.fileReader!.result as string).trim();

    console.log(result);

    // ERROR
    if (result.length !== 0) {
      // WARNING: WINDOWS SPECIFIC
      const rows = result.split('\r\n');
      const names = rows.filter((row, i) => i % 2 === 0);
      const scores = rows.filter((row, i) => i % 2 !== 0);

      console.log(names, scores);

      // ERROR
      if (names.length === scores.length) {
        const players = [] as Player[];
        let tmpScores;

        for (let i = 0; i < names.length; i++) {
          tmpScores = scores[i].split(',').map((score) => Number(score));

          players.push({
            name: names[i].trim(),
            rounds: this.convertToRounds(tmpScores),
            totalScore: 0,
          });
        }

        players.forEach((player) => this.calculatePlayerTotalScore(player));

        console.log(players);

        this.players.next(players);
      }
    }
  };

  private convertToRounds(scores: number[]): Round[] {
    const rounds = [];

    let throwId = 0;

    let isFinalRound;
    let throwIsStrike;

    for (let i = 0; i < 10; i++) {
      const round = { scores: [] } as Round;

      round.scores.push(scores[throwId]);

      isFinalRound = i === 9;

      if (isFinalRound) {
        round.scores.push(scores[throwId + 1]);

        throwIsStrike = scores[throwId] === 10;
        const throwsAreSpare = scores[throwId] + scores[throwId + 1] === 10;

        if (throwIsStrike || throwsAreSpare) {
          round.scores.push(scores[throwId + 2]);
        }
      } else {
        throwIsStrike = scores[throwId] === 10;

        if (!throwIsStrike) {
          round.scores.push(scores[throwId + 1]);

          throwId += 1;
        }
      }

      rounds.push(round);

      throwId += 1;
    }

    return rounds;
  }

  private calculatePlayerTotalScore(player: Player): void {
    let isFinalRound;
    let throwIsStrike;
    let throwsAreSpare;

    let roundScore;

    for (let i = 0; i < player.rounds.length; i++) {
      isFinalRound = i === player.rounds.length - 1;

      roundScore = player.rounds[i].scores.reduce(
        (result, score) => result + score
      );

      throwIsStrike = player.rounds[i].scores.length === 1;
      throwsAreSpare = !throwIsStrike && roundScore === 10;

      if (!isFinalRound) {
        if (throwIsStrike || throwsAreSpare) {
          roundScore += player.rounds[i + 1].scores[0];

          if (throwIsStrike) {
            roundScore +=
              player.rounds[i + 1].scores.length > 1
                ? player.rounds[i + 1].scores[1]
                : player.rounds[i + 2].scores[0];
          }
        }
      }

      player.totalScore += roundScore;
      player.rounds[i].totalScore = player.totalScore;
    }
  }
}
