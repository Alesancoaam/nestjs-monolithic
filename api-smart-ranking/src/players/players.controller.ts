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
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';
import { ValidationParamsPipe } from '../common/pipes/validation-params.pipe';

@Controller('/api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}
  @Get()
  getAllPlayer(): Promise<Player[]> {
    return this.playersService.getAllPlayers();
  }

  @Get('/search')
  getPlayerByEmail(@Query('email') email: string): Promise<Player> {
    return this.playersService.getPlayerByEmail(email);
  }

  @Get('/:_id')
  getPlayerById(@Param('_id', ValidationParamsPipe) _id: string): Promise<Player> {
    return this.playersService.getPlayerById(_id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playersService.createPlayer(createPlayerDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  updatePlayer(
    @Param('_id', ValidationParamsPipe) _id: string,
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return this.playersService.updatePlayer(_id, createPlayerDto);
  }

  @Delete('/:_id')
  @HttpCode(204)
  deletePlayer(@Param('_id', ValidationParamsPipe) _id: string): Promise<void> {
    return this.playersService.deletePlayer(_id);
  }
}
