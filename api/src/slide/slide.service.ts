//::================================>>Core library<<================================::
import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
//::================================================================================::

//::================================>>Third party<<=================================::
import { PrismaService } from 'src/prisma/prisma.service';
import { Slide, User } from '@prisma/client';
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { ResponseCreateOrUpdateDTO } from 'src/global/dto/response.create.update.dto';
import { ResponseDeleteDTO } from 'src/global/dto/response.delete.dto';
import { ResponseAllDto } from 'src/global/dto/response.all.dto';
//::================================================================================::

@Injectable()
export class SlideService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createSlideDto: CreateSlideDto,
    user: User,
    id: string,
  ): Promise<ResponseCreateOrUpdateDTO> {
    try {
      //::==>> check is manger of restaurant
      const isRestaurantManager = await this.prisma.restaurant.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });
      if (!isRestaurantManager) throw new UnauthorizedException();
      //::==>> create slide
      const slide = await this.prisma.slide.create({
        data: {
          ...createSlideDto,
          restaurant: {
            connect: { id },
          },
        },
      });
      return {
        data: slide,
        message: 'Created sucessfully',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<any> {
    try {
      //::==>> get all with pagination
      const skip = (page - 1) * pageSize;

      const totalCount = await this.prisma.restaurant.count();

      const totalPages = Math.ceil(totalCount / pageSize);

      const data = await this.prisma.slide.findMany({
        skip,
        take: pageSize,
      });
      //::==>>response back
      const response: ResponseAllDto<Slide> = {
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

  async findOne(id: string): Promise<any> {
    try {
      //::==>> check restaurant is valid id
      const restaurant = await this.prisma.restaurant.findUnique({
        where: {
          id,
        },
      });
      if (!restaurant) throw new NotFoundException();
      //::==>> get slide by restaurant
      const slides = await this.prisma.slide.findMany({
        where: {
          restaurantId: id,
        },
      });
      return slides;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateSlideDto: UpdateSlideDto,
    user: User,
  ): Promise<any> {
    try {
      //::==>> check get by id
      const slide = await this.prisma.slide.findUnique({
        where: {
          id,
        },
      });
      if (!slide) throw new NotFoundException();
      //::==>> check is manger of restaurant
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: slide.restaurantId },
        select: {
          userId: true,
        },
      });
      if (restaurant.userId !== user.id) throw new UnauthorizedException();
      //::==>> update slide
      const updatedSlide = await this.prisma.slide.update({
        where: {
          id,
        },
        data: updateSlideDto,
      });

      //::==>> response back
      return {
        data: updatedSlide,
        message: 'Updated sucessfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, user: User): Promise<ResponseDeleteDTO> {
    try {
      //::==>> check get by id
      const slide = await this.prisma.slide.findUnique({
        where: {
          id,
        },
      });
      if (!slide) throw new NotFoundException();
      //::==>> check is manger of restaurant
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: slide.restaurantId },
        select: {
          userId: true,
        },
      });
      if (restaurant.userId !== user.id) throw new UnauthorizedException();
      //::==>> delete slide
      await this.prisma.slide.delete({
        where: {
          id,
        },
      });

      //::==>> response back
      return {
        message: 'Deleted sucessfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }
}
