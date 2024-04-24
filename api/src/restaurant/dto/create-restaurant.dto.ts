import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Sit } from '../enum/sit.enum';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly logo: string;

  @IsNotEmpty()
  @IsString()
  readonly phoneOne: string;

  @IsString()
  @IsOptional()
  readonly phoneTwo: string;

  @IsUrl()
  @IsOptional()
  readonly facebookUrl: string;

  @IsString()
  @IsOptional()
  readonly workingTime: string;

  @IsOptional()
  @IsEnum(Sit)
  readonly sit?: Sit;
}
