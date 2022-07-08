import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    name: { type: String },
    phoneNumber: { type: String },
    ranking: { type: String },
    positionRanking: { type: Number },
    urlPhoto: { type: String },
  },
  { timestamps: true, collection: 'players' },
);
