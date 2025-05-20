import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestQuery, RequestWithUserPayload } from 'src/types/request.types';
import { WishesService } from 'src/wishes/wishes.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  getMe(@Req() req: RequestWithUserPayload) {
    return this.usersService.findOneByUsername(req.user.username);
  }

  @Patch('me')
  updateMe(
    @Req() req: RequestWithUserPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.id, updateUserDto, req.user.id);
  }

  @Get('me/wishes')
  getMyWishes(@Req() req: RequestWithUserPayload) {
    return this.wishesService.findAllByUsername(req.user.username);
  }

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.wishesService.findAllByUsername(username);
  }

  @Post('find')
  async findUser(@Body() query: RequestQuery) {
    return this.usersService.findUserByQuery(query);
  }
}
