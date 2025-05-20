import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, ownerId: number) {
    const wish = { ...createWishDto, owner: { id: ownerId } };
    await this.wishRepository.save(wish);
    return {};
  }

  findAllByUsername(username: string) {
    return this.wishRepository.find({
      where: { owner: { username } },
    });
  }

  async findLast() {
    const wishes = await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      relations: { owner: true, offers: false },
      take: 40,
    });

    return plainToInstance(Wish, wishes);
  }

  async findTop() {
    const wishes = await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: { owner: true, offers: false },
    });

    return plainToInstance(Wish, wishes);
  }

  findOne(id: number) {
    return this.wishRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.wishRepository.findOneBy({
      id,
      owner: { id: userId },
    });

    if (!wish) throw new NotFoundException();

    if (wish.offers.length > 0) {
      throw new ForbiddenException();
    }

    const updatedWhish = {
      ...wish,
      ...updateWishDto,
    };

    await this.wishRepository.save(updatedWhish);

    return {};
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishRepository.findOneBy({
      id,
      owner: { id: userId },
    });

    if (!wish) throw new NotFoundException();

    if (wish.offers.length > 0) {
      throw new ForbiddenException();
    }

    return this.wishRepository.remove(wish);
  }

  async copy(id: number, userId: number) {
    const wish = await this.wishRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException();

    const copied = Number(wish.copied) + 1;

    await this.wishRepository.save({ ...wish, copied });

    const { name, link, image, price, description } = wish;
    const copiedWish = {
      name,
      link,
      image,
      price,
      description,
      owner: { id: userId },
    };

    await this.wishRepository.save(copiedWish);

    return {};
  }
}
