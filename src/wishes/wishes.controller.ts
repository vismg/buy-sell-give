import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUserPayload } from 'src/types/request.types';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Req() req: RequestWithUserPayload,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: RequestWithUserPayload,
  ) {
    return this.wishesService.update(id, updateWishDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUserPayload,
  ) {
    return this.wishesService.remove(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/copy')
  copy(
    @Req() req: RequestWithUserPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.wishesService.copy(id, req.user.id);
  }
}
