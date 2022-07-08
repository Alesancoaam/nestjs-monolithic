import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}

  createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.create(createPlayerDto);
  }

  getAllPlayers(): Promise<Player[]> {
    return this.getAll();
  }

  getPlayerByEmail(email: string): Promise<Player> {
    return this.getByEmail(email);
  }

  getPlayerById(_id: string): Promise<Player> {
    return this.getById(_id);
  }

  updatePlayer(_id: string, createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.update(_id, createPlayerDto);
  }

  deletePlayer(_id: string): Promise<void> {
    return this.delete(_id);
  }

  // ---------------------------------------------------------------------------------------------------

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const playerUniqueEmail = await this.playerModel
      .findOne({ email: createPlayerDto.email })
      .exec();

    if (playerUniqueEmail) {
      throw new BadRequestException(`Email ${createPlayerDto.email} is already in use`);
    }

    const newPlayer = new this.playerModel(createPlayerDto);
    return await newPlayer.save();
  }

  private async getAll(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  private async getByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();
    if (!player) {
      throw new NotFoundException(`No player found with email ${email}`);
    }
    return player;
  }

  private async getById(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id }).exec();
    if (!player) {
      throw new NotFoundException(`No player found with id ${_id}`);
    }
    return player;
  }

  private async update(_id: string, createPlayerDto: CreatePlayerDto): Promise<Player> {
    const playerUniqueEmail = await this.playerModel
      .findOne({ _id: { $ne: _id }, email: createPlayerDto.email })
      .exec();

    if (playerUniqueEmail) {
      throw new BadRequestException(`Email ${createPlayerDto.email} is already in use`);
    }

    const player = await this.playerModel.findOne({ _id }).exec();
    if (!player) {
      throw new NotFoundException(`No player found with id ${_id}`);
    }
    return await this.playerModel
      .findOneAndUpdate({ _id }, { $set: createPlayerDto }, { new: true })
      .exec();
  }

  private async delete(_id: string): Promise<any> {
    const player = await this.playerModel.findOne({ _id }).exec();
    if (!player) {
      throw new NotFoundException(`No player found with id ${_id}`);
    }
    return await this.playerModel.findOneAndDelete({ _id }).exec();
  }
}
