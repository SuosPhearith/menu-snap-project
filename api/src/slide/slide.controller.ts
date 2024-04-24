import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SlideService } from './slide.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';

@Controller('slide')
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Post(':id')
  @UseGuards(AuthenticationGuard)
  create(
    @Body() createSlideDto: CreateSlideDto,
    @Req() { user },
    @Param('id') id: string,
  ) {
    return this.slideService.create(createSlideDto, user, id);
  }

  @Get()
  findAll() {
    return this.slideService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  findOne(@Param('id') id: string) {
    return this.slideService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  update(
    @Param('id') id: string,
    @Body() updateSlideDto: UpdateSlideDto,
    @Req() { user },
  ) {
    return this.slideService.update(id, updateSlideDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  remove(@Param('id') id: string, @Req() { user }) {
    return this.slideService.remove(id, user);
  }
}
