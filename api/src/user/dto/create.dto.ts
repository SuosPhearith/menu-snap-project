import {
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/enum/signup.enum';

export class CreateDTO {
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
  @IsEnum(Role)
  readonly role: Role;
}
