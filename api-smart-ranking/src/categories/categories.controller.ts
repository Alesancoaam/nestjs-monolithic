import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('/api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAllCategories();
  }

  @Get('/search')
  getCategoriesByParams(@Query('category') category: string): Promise<Category[]> {
    return this.categoryService.getCategoriesByParams(category);
  }

  @Get('/:_id')
  async getCategoryById(@Param('_id', ValidationParamsPipe) _id: string): Promise<Category> {
    return await this.categoryService.getCategoryById(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Param('_id', ValidationParamsPipe) _id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(_id, updateCategoryDto);
  }

  @Delete('/:_id')
  @HttpCode(204)
  deleteCategory(@Param('_id', ValidationParamsPipe) _id: string): Promise<void> {
    return this.categoryService.deleteCategory(_id);
  }

  @Post('/:categoryId/players/:playerId')
  linkUserToCategory(
    @Param('categoryId') categoryId: string,
    @Param('playerId') playerId: string,
  ): Promise<Category> {
    return this.categoryService.linkUserToCategory(categoryId, playerId);
  }
}
