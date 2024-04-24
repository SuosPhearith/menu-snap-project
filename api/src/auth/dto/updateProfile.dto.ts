import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Gender } from '../enum/signup.enum';

export class UpdateProfileDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly name: string;

  @IsOptional()
  readonly avatar?: string;

  @IsOptional()
  @IsEnum(Gender)
  readonly gender?: Gender;
}
