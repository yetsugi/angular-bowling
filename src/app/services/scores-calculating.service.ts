import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/player';
import { Round } from '../models/round';

@Injectable({
  providedIn: 'root',
})
export class ScoresCalculatingService {
  players = new BehaviorSubject<Player[] | null>(null);
  parseErrorMsg = new BehaviorSubject<string | null>(null);

  private readonly fileReader = new FileReader();

  constructor() {
    this.fileReader.onload = this.loadFile;
  }

  calculateScores(scoresFile: File): void {
    this.clearPlayers();
    this.clearErrorMsg();

    this.fileReader.readAsText(scoresFile);
  }

  clearPlayers(): void {
    this.players.next(null);
  }

  clearErrorMsg(): void {
    this.parseErrorMsg.next(null);
  }

  private loadFile = (): void => {
    const result = (this.fileReader!.result as string).trim();

    try {
      if (result.length === 0) {
        throw new Error('File is empty.');
      }

      // Warning: Windows specific
      const rows = result.split('\r\n');

      const names = rows.filter((row, i) => i % 2 === 0);
      const scores = rows.filter((row, i) => i % 2 !== 0);

      if (names.length !== scores.length) {
        throw new Error("Players count doesn't match scores count.");
      }

      const players = [] as Player[];
      let tmpScores;

      for (let i = 0; i < names.length; i++) {
        tmpScores = scores[i].split(',').map((score) => Number(score));

        if (tmpScores.length < 12) {
          throw new Error('Scores are missing.');
        }

        if (tmpScores.length > 21) {
          throw new Error('Too many scores.');
        }

        if (tmpScores.some((score) => isNaN(score))) {
          throw new Error('Invalid scores format.');
        }

        players.push({
          name: names[i].trim(),
          rounds: this.convertToRounds(tmpScores),
          totalScore: 0,
        });
      }

      players.forEach((player) => this.calculatePlayerTotalScore(player));

      if (players.some((player) => isNaN(player.totalScore))) {
        throw new Error('Calculation error.');
      }

      this.players.next(players);
    } catch (error) {
      if (error instanceof Error) {
        this.parseErrorMsg.next(error.message);
      } else {
        this.parseErrorMsg.next('Failed to load provided file..');
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
