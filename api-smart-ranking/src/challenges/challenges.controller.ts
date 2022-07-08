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
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';

@Controller('/api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengeService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createChallenge(@Body() createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    return this.challengeService.createChallenge(createChallengeDto);
  }

  @Get()
  getAllChallenges(): Promise<Challenge[]> {
    return this.challengeService.getAllChallenges();
  }

  @Get('/search')
  getChallengesByParams(@Query('playerId') playerId: string): Promise<Challenge[]> {
    return this.challengeService.getChallengesByParams(playerId);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  updateChallenge(
    @Param('_id', ValidationParamsPipe) _id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    return this.challengeService.updateChallenge(_id, updateChallengeDto);
  }

  @Delete(':_id')
  @HttpCode(204)
  deleteChallenge(@Param('_id', ValidationParamsPipe) _id: string): Promise<void> {
    return this.challengeService.deleteChallenge(_id);
  }
}
