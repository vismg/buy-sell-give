import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { itemId, amount, ...rest } = createOfferDto;
    const wish = await this.wishRepository.findOne({
      where: { id: itemId },
      relations: { owner: true },
    });

    if (!wish) throw new NotFoundException();

    if (wish.owner.id === userId) {
      throw new BadRequestException('You cannot offer your own item');
    }

    const newRaised = Number(wish.raised) + Number(amount);
    if (newRaised > Number(wish.price)) {
      throw new BadRequestException(
        `Offer ${amount} exceeds rest of the sum ${Number(wish.price) - Number(wish.raised)}`,
      );
    }

    await this.offerRepository.save({
      ...rest,
      amount,
      item: { id: itemId },
      user: { id: userId },
    });

    await this.wishRepository.update(itemId, {
      raised: newRaised,
    });

    return {};
  }

  findAll() {
    return this.offerRepository.find({
      relations: {
        item: {
          owner: true,
          offers: true,
        },
        user: {
          wishes: {
            owner: true,
            offers: true,
          },
          offers: {
            item: {
              owner: true,
            },
          },
          wishlists: {
            owner: true,
            items: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.offerRepository.findOne({
      where: { id },
      relations: {
        item: {
          owner: true,
          offers: true,
        },
        user: {
          wishes: {
            owner: true,
            offers: true,
          },
          offers: {
            item: {
              owner: true,
            },
          },
          wishlists: {
            owner: true,
            items: true,
          },
        },
      },
    });
  }
}
