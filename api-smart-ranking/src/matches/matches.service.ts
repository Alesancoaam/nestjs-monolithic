import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengesService } from 'src/challenges/challenges.service';
import { AssignMatchChallenge } from './dtos/assign-match-challenge.dto';
import { Match } from './interfaces/match.interface';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly challengesService: ChallengesService,
  ) {}

  createMatch(assignMatchChallenge: AssignMatchChallenge): Promise<Match> {
    return this.create(assignMatchChallenge);
  }

  private async create(assignMatchChallenge: AssignMatchChallenge): Promise<Match> {
    const { challenge, def } = assignMatchChallenge;

    const foundedChallenge = await this.challengesService.getChallengeById(challenge);

    if (!foundedChallenge) {
      throw new BadRequestException(`No challenge found with id ${challenge}`);
    }

    const player = foundedChallenge.players.filter((player) => player._id == def);

    if (!player.length) {
      throw new BadRequestException(`The winning player is not part of the challenge`);
    }

    const matchInstance = new this.matchModel(assignMatchChallenge);
    matchInstance.category = foundedChallenge.category;
    matchInstance.players = foundedChallenge.players;

    const match = await matchInstance.save();

    await this.challengesService.accomplishChallenge(foundedChallenge._id, match._id);

    return match;
  }
}
