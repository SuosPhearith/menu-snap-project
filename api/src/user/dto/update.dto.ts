import { IsEnum, IsOptional } from 'class-validator';
import { UpdateProfileDTO } from 'src/auth/dto/updateProfile.dto';
import { Role } from 'src/auth/enum/signup.enum';

export class UpdateDTO extends UpdateProfileDTO {
  @IsOptional()
  @IsEnum(Role)
  readonly role: Role;
}
