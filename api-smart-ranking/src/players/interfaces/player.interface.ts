import { Document } from 'mongoose';

export interface Player extends Document {
  email: string;
  name: string;
  phoneNumber: string;
  ranking: string;
  positionRanking: number;
  urlPhoto: string;
}
