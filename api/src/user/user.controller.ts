import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization/authorization.guard';
import { CreateDTO } from './dto/create.dto';
import { UpdateDTO } from './dto/update.dto';

@Roles(['admin'])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id/reset-password')
  async resetPassword(@Param('id') id: string) {
    return this.userService.resetPassword(id);
  }

  @Delete(':id/delete-account')
  async deleteAccount(@Param('id') id: string) {
    return this.userService.deleteAccount(id);
  }

  @Patch(':id/disactivate-account')
  async disactivateAccount(@Param('id') id: string) {
    return this.userService.disactivateAccount(id);
  }

  @Patch(':id/activate-account')
  async activateAccount(@Param('id') id: string) {
    return this.userService.activateAccount(id);
  }

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.userService.getAll(page, pageSize);
  }

  @Post()
  async create(@Body() createDTO: CreateDTO) {
    return this.userService.create(createDTO);
  }

  @Patch(':id')
  async update(@Body() updateDto: UpdateDTO, @Param('id') id: string) {
    return this.userService.update(updateDto, id);
  }

  @Delete(':id/destroy-account')
  async destroyUser(@Param('id') id: string) {
    return this.userService.destroyUser(id);
  }
}
