import { Round } from './round';

export interface Player {
  name: string;
  rounds: Round[];
  totalScore: number;
}
