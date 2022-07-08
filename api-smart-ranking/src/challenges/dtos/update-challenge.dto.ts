import { IsEnum, IsOptional } from 'class-validator';
import { challengeEnum } from '../interfaces/challenge-status.enum';

export class UpdateChallengeDto {
  @IsOptional()
  @IsEnum(challengeEnum)
  status: challengeEnum;

  @IsOptional()
  datetimeChallenge: Date;
}
