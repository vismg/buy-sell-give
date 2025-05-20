import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { RequestQuery } from 'src/types/request.types';

@Injectable()
export class UsersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    return plainToInstance(User, await this.usersRepository.save(user));
  }

  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) throw new NotFoundException();

    return {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      about: user.about,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findOneByUsernameWithHash(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) throw new NotFoundException();

    return user;
  }

  async findOneByEmailOrUsername({ email, username }: UpdateUserDto) {
    return plainToInstance(
      User,
      await this.usersRepository.findOne({
        where: [{ email }, { username }],
      }),
    );
  }

  async findUserByQuery(query: RequestQuery) {
    return plainToInstance(
      User,
      await this.usersRepository.find({
        where: [
          { username: Like(`%${query.query}%`) },
          { email: Like(`%${query.query}%`) },
        ],
      }),
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
    if (id !== userId) throw new ForbiddenException();

    const user = await this.usersRepository.findBy({ id });

    if (!user) throw new NotFoundException();

    const updatedUser = Object.assign(user, updateUserDto);

    return plainToInstance(User, await this.usersRepository.save(updatedUser));
  }
}
