import { Injectable, NotFoundException } from '@nestjs/common';
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

  create(createWishlistDto: CreateWishlistDto, userId: number) {
    const { itemsId, ...rest } = createWishlistDto;

    const wishlist = this.wishlistRepository.create({
      ...rest,
      owner: { id: userId },
      items: itemsId.map((id) => ({ id })),
    });

    return this.wishlistRepository.save(wishlist);
  }

  async findAll() {
    return this.wishlistRepository.find();
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistRepository
      .createQueryBuilder('wishlist')
      .leftJoinAndSelect('wishlist.owner', 'owner')
      .leftJoinAndSelect('wishlist.items', 'items')
      .where('wishlist.id = :id', { id })
      .getOne();

    if (!wishlist) {
      throw new NotFoundException();
    }

    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.wishlistRepository.findOneBy({
      id,
      owner: { id: userId },
    });

    if (!wishlist) throw new NotFoundException();

    const updatedWishlist = {
      ...wishlist,
      ...updateWishlistDto,
    };

    return this.wishlistRepository.save(updatedWishlist);
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.wishlistRepository.findOneBy({
      id,
      owner: { id: userId },
    });

    if (!wishlist) throw new NotFoundException();

    return this.wishlistRepository.remove(wishlist);
  }
}
