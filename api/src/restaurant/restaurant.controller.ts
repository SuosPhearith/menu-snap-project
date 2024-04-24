import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  async create(
    @Req() { user },
    @Body() createRestaurantDto: CreateRestaurantDto,
  ) {
    return this.restaurantService.create(createRestaurantDto, user);
  }

  @Get()
  async findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Req() { user },
  ) {
    return this.restaurantService.update(id, updateRestaurantDto, user);
  }

  @Patch(':id/sit')
  @UseGuards(AuthenticationGuard)
  updateSit(@Param('id') id: string, @Req() { user }) {
    return this.restaurantService.updateSit(id, user);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  async remove(@Param('id') id: string, @Req() { user }) {
    return this.restaurantService.remove(id, user);
  }
}
