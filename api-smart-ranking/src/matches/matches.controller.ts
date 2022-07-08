import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AssignMatchChallenge } from './dtos/assign-match-challenge.dto';
import { Match } from './interfaces/match.interface';
import { MatchesService } from './matches.service';

@Controller('/api/v1/matches')
export class MatchesController {
  constructor(private readonly matchService: MatchesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createMatch(@Body() assignMatchChallenge: AssignMatchChallenge): Promise<Match> {
    return this.matchService.createMatch(assignMatchChallenge);
  }
}
