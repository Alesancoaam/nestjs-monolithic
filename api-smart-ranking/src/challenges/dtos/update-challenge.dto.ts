import { IsEnum, IsOptional } from 'class-validator';
import { challengeEnum } from '../interfaces/challenge-status.enum';
import { Match } from '../interfaces/challenge.interface';

export class UpdateChallengeDto {
  @IsOptional()
  @IsEnum(challengeEnum)
  status: challengeEnum;

  @IsOptional()
  datetimeChallenge: Date;

  @IsOptional()
  match: Match;
}
