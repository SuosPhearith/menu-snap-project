//::================================>>Core library<<================================::
import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
//::================================================================================::

//::================================>>Third party<<=================================::
import { Restaurant, User } from '@prisma/client';
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseCreateOrUpdateDTO } from 'src/global/dto/response.create.update.dto';
import { ResponseDeleteDTO } from 'src/global/dto/response.delete.dto';
import { ResponseAllDto } from 'src/global/dto/response.all.dto';
//::================================================================================::

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createRestaurantDto: CreateRestaurantDto,
    user: User,
  ): Promise<ResponseCreateOrUpdateDTO> {
    try {
      const restaurant = await this.prisma.restaurant.create({
        data: {
          userId: user.id,
          ...createRestaurantDto,
        },
      });
      //::==>>response back
      const response: ResponseCreateOrUpdateDTO = {
        data: restaurant,
        message: 'Created successfully',
        statusCode: HttpStatus.CREATED,
      };

      return response;
    } catch (error) {
      //::==>>check if duplicate
      console.error(error);
      if (error.code === 'P2002')
        throw new ConflictException('Name already exists');
      throw error;
    }
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<any> {
    try {
      //::==>> get all with pagination
      const skip = (page - 1) * pageSize;

      const totalCount = await this.prisma.restaurant.count();

      const totalPages = Math.ceil(totalCount / pageSize);

      const data = await this.prisma.restaurant.findMany({
        skip,
        take: pageSize,
      });
      //::==>>response back
      const response: ResponseAllDto<Restaurant> = {
        data,
        totalCount,
        totalPages,
        currentPage: page,
        pageSize,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    //::==>> find one
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });
    if (!restaurant) {
      throw new NotFoundException();
    }
    return restaurant;
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    user: User,
  ): Promise<ResponseCreateOrUpdateDTO> {
    try {
      //::==>> check is correct id
      const isRestaurant = await this.prisma.restaurant.findUnique({
        where: {
          id,
        },
      });
      if (!isRestaurant) {
        throw new NotFoundException();
      }
      //::==>>check before update
      if (isRestaurant.userId !== user.id) {
        throw new UnauthorizedException();
      }
      //::==>> start update
      const restaurant = await this.prisma.restaurant.update({
        where: {
          id,
        },
        data: updateRestaurantDto,
      });
      //::==>>response back
      return {
        data: restaurant,
        message: 'Updated successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      //::==>>check if duplicate
      if (error.code === 'P2002')
        throw new ConflictException('Name already exists');
      throw error;
    }
  }

  async remove(id: string, user: User): Promise<ResponseDeleteDTO> {
    //::==>> check is correct id
    const isRestaurant = await this.prisma.restaurant.findUnique({
      where: {
        id,
      },
    });
    if (!isRestaurant) {
      throw new NotFoundException();
    }
    //::==>>check before update
    if (isRestaurant.userId !== user.id) {
      throw new UnauthorizedException();
    }
    await this.prisma.restaurant.delete({
      where: { id: isRestaurant.id },
    });

    //::==>> response back
    const response: ResponseDeleteDTO = {
      message: 'Deleted successfully',
      statusCode: HttpStatus.OK,
    };
    return response;
  }

  async updateSit(id: string, user: User): Promise<ResponseCreateOrUpdateDTO> {
    try {
      //::==>> check is correct id
      const isRestaurant = await this.prisma.restaurant.findUnique({
        where: {
          id,
        },
      });
      if (!isRestaurant) {
        throw new NotFoundException();
      }
      //::==>>check before update
      if (isRestaurant.userId !== user.id) {
        throw new UnauthorizedException();
      }
      //::==>>check sit information before update
      let sitInfo = isRestaurant.sit;
      if (sitInfo === 'available') {
        sitInfo = 'unavailable';
      } else {
        sitInfo = 'available';
      }
      //::==>> start update
      const restaurant = await this.prisma.restaurant.update({
        where: {
          id,
        },
        data: {
          sit: sitInfo,
        },
      });
      //::==>> response back
      return {
        data: restaurant,
        message: 'Updated successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}
