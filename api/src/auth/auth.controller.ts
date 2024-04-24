import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { User } from '@prisma/client';
import { SigninDTO } from './dto/signin.dto';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { UpdateProfileDTO } from './dto/updateProfile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO): Promise<User> {
    return this.authService.signup(signupDTO);
  }
  @Post('signin')
  async signin(@Body() signin: SigninDTO): Promise<any> {
    return this.authService.signin(signin);
  }
  @Get('me')
  @UseGuards(AuthenticationGuard)
  me(@Req() { user }) {
    return user;
  }

  @Patch('change-password')
  @UseGuards(AuthenticationGuard)
  async changePassword(
    @Body() changePassword: ChangePasswordDTO,
    @Req() { user },
  ) {
    return this.authService.changePassword(changePassword, user);
  }

  @Patch('update-profile')
  @UseGuards(AuthenticationGuard)
  async updateProfile(
    @Body() updateProfileDTO: UpdateProfileDTO,
    @Req() { user },
  ) {
    return this.authService.updateProfile(updateProfileDTO, user);
  }

  @Delete('delete-account')
  @UseGuards(AuthenticationGuard)
  async deleteAccount(@Req() { user }) {
    return this.authService.deleteAccount(user);
  }
}
