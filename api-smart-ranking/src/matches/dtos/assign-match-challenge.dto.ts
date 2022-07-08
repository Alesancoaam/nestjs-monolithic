import { IsNotEmpty } from 'class-validator';
import { Challenge, Match } from 'src/challenges/interfaces/challenge.interface';
import { Player } from 'src/players/interfaces/player.interface';

export class AssignMatchChallenge {
  @IsNotEmpty()
  challenge: Challenge;

  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<Match>;
}
