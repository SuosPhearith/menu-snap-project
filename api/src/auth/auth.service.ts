import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDTO } from './dto/signup.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SigninDTO } from './dto/signin.dto';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { UpdateProfileDTO } from './dto/updateProfile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async signup(signupDTO: SignupDTO): Promise<User> {
    try {
      //::==>>hash password
      const hashedPassword = await bcrypt.hash(signupDTO.password, 10);
      //::==>>apply hash password
      const savedUser = { ...signupDTO, password: hashedPassword };
      const newUser = await this.prisma.user.create({
        data: savedUser,
      });
      //::==>>remove field password
      newUser.password = undefined;
      return newUser;
    } catch (error) {
      //::==>>check if duplicate
      if (error.code === 'P2002')
        throw new ConflictException('Phone already exists');
      throw error;
    }
  }

  async signin(signinDTO: SigninDTO): Promise<any> {
    try {
      // return signinDTO;
      const { phone, password } = signinDTO;
      //::==>> find unique user
      const user = await this.prisma.user.findFirst({
        where: {
          phone,
        },
      });
      //::==>>check account is valid
      if (user.deletedAt || !user.active) throw new UnauthorizedException();
      // return user;
      if (!user) throw new UnauthorizedException('Invalid phone');
      //::==>> compare password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) throw new UnauthorizedException('Invalid password');
      //::==>> generate jwt
      user.password = undefined;
      const token = await this.jwtService.signAsync({
        id: user.id,
      });
      //::==>> response back
      return {
        user,
        token,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    changePasswordDTO: ChangePasswordDTO,
    user: User,
  ): Promise<any> {
    try {
      //::==>>get value
      const { currentPassword, newPassword, confirmPassword } =
        changePasswordDTO;
      //::==>>check confirm password
      if (newPassword !== confirmPassword)
        throw new BadRequestException('Invalid confirmation password');
      //::==>>check old password
      const userWithPassword = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: {
          password: true,
        },
      });
      const { password } = userWithPassword;
      if (!(await bcrypt.compare(currentPassword, password)))
        throw new BadRequestException('Invalid current password');
      //::==>>change password
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(newPassword, 10) },
      });
      //::==>>response back
      return {
        message: 'Updated successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(
    updateProfileDTO: UpdateProfileDTO,
    user: User,
  ): Promise<any> {
    try {
      //::==>>update
      await this.prisma.user.update({
        where: { id: user.id },
        data: updateProfileDTO,
      });
      //::==>>response back
      return {
        message: 'Updated successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(user: User): Promise<any> {
    try {
      //::==>> delete account
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          deletedAt: new Date(),
        },
      });
      //::==>>response back
      return {
        message: 'Deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}
