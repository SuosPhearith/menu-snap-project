import { IsNotEmpty } from 'class-validator';

export class SigninDTO {
  @IsNotEmpty()
  readonly phone: string;
  @IsNotEmpty()
  readonly password: string;
}
