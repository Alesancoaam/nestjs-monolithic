import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
