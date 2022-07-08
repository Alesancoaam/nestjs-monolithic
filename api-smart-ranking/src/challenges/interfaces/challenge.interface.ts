import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { challengeEnum } from './challenge-status.enum';

export interface Challenge extends Document {
  datetimeChallenge: Date;
  status: challengeEnum;
  datetimeSolicitation: Date;
  datetimeResponse: Date;
  requester: Player;
  category: string;
  players: Array<Player>;
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
