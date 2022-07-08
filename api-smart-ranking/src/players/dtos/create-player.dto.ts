import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePlayerDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phoneNumber: string;
}
