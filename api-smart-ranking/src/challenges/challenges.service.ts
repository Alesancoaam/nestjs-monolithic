import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { challengeEnum } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  createChallenge(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    return this.create(createChallengeDto);
  }

  getAllChallenges(): Promise<Challenge[]> {
    return this.getAll();
  }

  getChallengesByParams(playerId: string): Promise<Challenge[]> {
    return this.getByParams(playerId);
  }

  updateChallenge(_id: string, updateChallengeDto: UpdateChallengeDto): Promise<Challenge> {
    return this.update(_id, updateChallengeDto);
  }

  deleteChallenge(_id: string): Promise<void> {
    return this.delete(_id);
  }

  // ---------------------------------------------------------------------------------------------------

  private async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const { players, requester } = createChallengeDto;
    let requesterIsInChallenge = false;

    for (const { _id } of players) {
      const player = await this.playersService.getPlayerById(_id);

      if (!player) {
        throw new NotFoundException(`No player found with id ${_id}`);
      }

      requesterIsInChallenge = _id === requester ? true : requesterIsInChallenge;
    }

    if (!requesterIsInChallenge) {
      throw new NotFoundException(`Requester must be a player in the match`);
    }

    const requesterCategory = await this.categoriesService.getCategoryByPlayerId(requester);

    if (!requesterCategory) {
      throw new NotFoundException(`Requester must be registered in a category`);
    }

    const challenge = new this.challengeModel({
      ...createChallengeDto,
      category: requesterCategory.category,
      datetimeSolicitation: new Date(),
      status: challengeEnum.PENDING,
    });
    return await challenge.save();
  }

  private async getAll(): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .select({ __v: 0 })
      .exec();
  }

  private async getByParams(playerId: string): Promise<Challenge[]> {
    return this.challengeModel
      .find({
        players: {
          $elemMatch: { $eq: playerId },
        },
      })
      .populate('requester')
      .populate('players')
      .populate('match')
      .select({ __v: 0 })
      .exec();
  }

  private async update(_id: string, updateChallengeDto: UpdateChallengeDto): Promise<Challenge> {
    const challenge = await this.challengeModel.findById(_id).exec();

    if (!challenge) {
      throw new BadRequestException(`No challenge found with id ${_id}`);
    }

    if (updateChallengeDto.status) {
      challenge.datetimeResponse = new Date();
    }
    challenge.status = updateChallengeDto.status;
    challenge.datetimeChallenge = updateChallengeDto.datetimeChallenge;

    return await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challenge }, { new: true })
      .exec();
  }

  private async delete(_id: string): Promise<any> {
    const challenge = await this.challengeModel.findById(_id).exec();
    if (!challenge) {
      throw new BadRequestException(`No challenge found with id ${_id}`);
    }
    return await this.challengeModel.findOneAndDelete({ _id }).exec();
  }
}
