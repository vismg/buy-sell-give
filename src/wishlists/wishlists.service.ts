import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  create(createWishlistDto: CreateWishlistDto) {
    return this.wishlistRepository.save(createWishlistDto);
  }

  findAll() {
    return this.wishlistRepository.find();
  }

  findOne(id: number) {
    return this.wishlistRepository.findBy({ id });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.wishlistRepository.findBy({ id });

    // todo: fix error pipeline
    if (!wishlist) throw new Error();

    const updatedWishlist = {
      ...wishlist,
      ...updateWishlistDto,
    };

    return this.wishlistRepository.save(updatedWishlist);
  }

  async remove(id: number) {
    const wishlist = await this.wishlistRepository.findBy({ id });

    // todo: fix error pipeline
    if (!wishlist) throw new Error();

    return this.wishlistRepository.remove(wishlist);
  }
}
