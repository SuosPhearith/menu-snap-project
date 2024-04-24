import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateDTO } from './dto/create.dto';
import { UpdateDTO } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async resetPassword(id: string): Promise<any> {
    try {
      //::==>> check is valid id
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Id not found');
      //::==>> reset user password
      await this.prisma.user.update({
        where: { id },
        data: { password: await bcrypt.hash(user.phone, 10) },
      });
      //::==>>response back
      return {
        message: 'Reset successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(id: string): Promise<any> {
    try {
      //::==>> check is valid id
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Id not found');
      //::==>> check is not super admin
      if (user.role === 'admin' && user.phone === process.env.SUPER_ADMIN_PHONE)
        throw new UnauthorizedException('Can not delete super admin');
      //::==>> delete account
      await this.prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
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

  async disactivateAccount(id: string): Promise<any> {
    try {
      //::==>> check is valid id
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Id not found');
      //::==>> check is not super admin
      if (user.role === 'admin' && user.phone === process.env.SUPER_ADMIN_PHONE)
        throw new UnauthorizedException('Can not disactivate super admin');
      //::==>> delete account
      await this.prisma.user.update({
        where: { id },
        data: { active: false },
      });
      //::==>>response back
      return {
        message: 'Disactivate successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async activateAccount(id: string): Promise<any> {
    try {
      //::==>> check is valid id
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Id not found');
      //::==>> delete account
      await this.prisma.user.update({
        where: { id },
        data: { active: true },
      });
      //::==>>response back
      return {
        message: 'Activate successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll(page: number = 1, pageSize: number = 10): Promise<any> {
    try {
      //::==>> get all with pagination
      const skip = (page - 1) * pageSize;

      const totalCount = await this.prisma.user.count({
        where: { deletedAt: null },
      });

      const totalPages = Math.ceil(totalCount / pageSize);

      const data = await this.prisma.user.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
          active: true,
          avatar: true,
          gender: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
        skip,
        take: pageSize,
      });
      //::==>>response back
      return {
        data,
        totalCount,
        totalPages,
        currentPage: page,
        pageSize,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(createDTO: CreateDTO): Promise<any> {
    try {
      //::==>>create account
      const user = await this.prisma.user.create({
        data: {
          name: createDTO.name,
          phone: createDTO.phone,
          password: await bcrypt.hash(createDTO.phone, 10),
          role: createDTO.role,
        },
      });
      delete user.password;
      //::==>>response back
      return {
        user,
        message: 'Created successfully',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      //::==>>check if duplicate
      if (error.code === 'P2002')
        throw new ConflictException('Phone already exists');
      throw error;
    }
  }

  async update(updateDTO: UpdateDTO, id: string): Promise<any> {
    try {
      //::==>> check is valid id
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Id not found');
      //::==>> update account
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateDTO,
      });
      delete updatedUser.password;
      //::==>>response back
      return {
        user: updatedUser,
        message: 'Updated successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async destroyUser(id: string): Promise<any> {
    try {
      //::==>> check id
      const user = await this.prisma.user.findUnique({ where: { id } });
      //::==>> check is not super admin
      if (user.role === 'admin' && user.phone === process.env.SUPER_ADMIN_PHONE)
        throw new UnauthorizedException('Can not disactivate super admin');
      if (!user) throw new NotFoundException('Id not found');
      await this.prisma.user.delete({ where: { id: user.id } });
      //::==>>response back
      return {
        message: 'Destroy successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}
