import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSlideDto {
  @IsString()
  @IsNotEmpty()
  readonly imageUrl: string;
}
