import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  create(createOfferDto: CreateOfferDto) {
    return this.offerRepository.save(createOfferDto);
  }

  findAll() {
    return this.offerRepository.find();
  }

  findOne(id: number) {
    return this.offerRepository.findBy({ id });
  }

  async update(id: number, updateOfferDto: UpdateOfferDto) {
    const offer = await this.offerRepository.findBy({ id });

    // todo: fix error pipeline
    if (!offer) throw new Error();

    const updatedOffer = {
      ...offer,
      ...updateOfferDto,
    };

    return this.offerRepository.save(updatedOffer);
  }

  async remove(id: number) {
    const offer = await this.offerRepository.findBy({ id });

    // todo: fix error pipeline
    if (!offer) throw new Error();

    return this.offerRepository.remove(offer);
  }
}
