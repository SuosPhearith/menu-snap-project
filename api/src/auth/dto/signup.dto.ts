import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Gender, Role } from '../enum/signup.enum';

export class SignupDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly name: string;

  @IsNotEmpty()
  @IsPhoneNumber('KH')
  @MinLength(8)
  @MaxLength(15)
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsOptional()
  @IsEnum(Gender)
  readonly gender?: Gender;
}
