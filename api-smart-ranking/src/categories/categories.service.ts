import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.create(createCategoryDto);
  }

  getAllCategories(): Promise<Category[]> {
    return this.getAll();
  }

  getCategoriesByParams(category: string): Promise<Category[]> {
    return this.getByParams(category);
  }

  getCategoryById(_id: string): Promise<Category> {
    return this.getById(_id);
  }

  updateCategory(_id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.update(_id, updateCategoryDto);
  }

  deleteCategory(_id: string): Promise<void> {
    return this.delete(_id);
  }

  linkUserToCategory(categoryId: string, playerId: string): Promise<Category> {
    return this.linkToCategory(categoryId, playerId);
  }

  getCategoryByPlayerId(playerId: any): Promise<Category> {
    return this.getByPlayerId(playerId);
  }

  // ---------------------------------------------------------------------------------------------------

  private async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryUniqueCategory = await this.categoryModel.findOne({
      category: createCategoryDto.category,
    });

    if (categoryUniqueCategory) {
      throw new BadRequestException(`Category ${createCategoryDto.category} already exist}`);
    }

    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }

  private async getAll(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').select({ __v: 0 }).exec();
  }

  private async getByParams(category: string): Promise<Category[]> {
    return await this.categoryModel.find({ category }).exec();
  }

  private async getById(_id: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id }).exec();
    if (!category) {
      throw new NotFoundException(`No category found with id ${_id}`);
    }
    return category;
  }

  private async update(_id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id }).exec();
    if (!category) {
      throw new NotFoundException(`No cateogry found with id ${_id}`);
    }
    return await this.categoryModel
      .findOneAndUpdate({ _id }, { $set: updateCategoryDto }, { new: true })
      .exec();
  }

  private async delete(_id: string): Promise<any> {
    const category = await this.categoryModel.findOne({ _id }).exec();
    if (!category) {
      throw new NotFoundException(`No category found with id ${_id}`);
    }
    return await this.categoryModel.findOneAndDelete({ _id }).exec();
  }

  private async linkToCategory(categoryId: string, playerId: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ categoryId }).exec();
    if (!category) {
      throw new NotFoundException(`No category found with id ${categoryId}`);
    }
    const player = await this.playersService.getPlayerById(playerId);
    if (!player) {
      throw new NotFoundException(`No player found with id ${playerId}`);
    }
    const playerIsAlreadyLinkedToCategory = await this.categoryModel
      .find({
        players: {
          $elemMatch: { $eq: playerId },
        },
      })
      .exec();
    if (playerIsAlreadyLinkedToCategory.length) {
      throw new BadRequestException(`User ${playerId} is already linked to category ${categoryId}`);
    }

    category.players.push(player);
    return await this.categoryModel
      .findOneAndUpdate({ categoryId }, { $set: category }, { new: true })
      .exec();
  }

  private async getByPlayerId(playerId: any): Promise<Category> {
    return await this.categoryModel
      .findOne({
        players: {
          $elemMatch: { $eq: playerId },
        },
      })
      .exec();
  }
}
