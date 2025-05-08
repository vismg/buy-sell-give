import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto) {
    return this.wishRepository.save(createWishDto);
  }

  findAll() {
    return this.wishRepository.find();
  }

  findOne(id: number) {
    return this.wishRepository.findBy({ id });
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishRepository.findBy({ id });

    // todo: fix error pipeline
    if (!wish) throw new Error();

    const updatedWhish = {
      ...wish,
      ...updateWishDto,
    };

    return this.wishRepository.save(updatedWhish);
  }

  async remove(id: number) {
    const wish = await this.wishRepository.findBy({ id });

    // todo: fix error pipeline
    if (!wish) throw new Error();

    return this.wishRepository.remove(wish);
  }
}
