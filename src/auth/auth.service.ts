import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/request.types';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findOneByUsernameWithHash(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return {
      ...user,
      password,
    };
  }

  async signin(user: User) {
    const payload: JwtPayload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    const { id, username, email, avatar, about, createdAt, updatedAt } = user;

    return {
      id,
      username,
      email,
      avatar,
      about,
      createdAt,
      updatedAt,
      access_token: accessToken,
    };
  }

  async signup(signupDto: SignupDto) {
    const saltRounds = this.configService.get<number>('SALT_ROUNDS');

    if (!saltRounds)
      throw new InternalServerErrorException('SALT_ROUNDS is not set');

    const { email, password, username, avatar, about } = signupDto;

    const user = await this.usersService.findOneByEmailOrUsername({
      email,
      username,
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const createdUser = await this.usersService.create({
      email,
      password: hash,
      username,
      avatar,
      about,
    });

    return createdUser;
  }
}
