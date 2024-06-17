import {
  Body,
  Controller,
  Get,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guard/auth.guard';
import { UpdateUserDto } from './dto/user.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUser(@Request() req) {
    return this.usersService.getUser(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateUser(
    @Request() req,
    @Body(new ValidationPipe()) bodyData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user.id, bodyData);
  }
}
