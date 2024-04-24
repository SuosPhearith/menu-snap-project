import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  readonly currentPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  readonly newPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  readonly confirmPassword: string;
}
