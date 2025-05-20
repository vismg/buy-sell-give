import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, UserPayload } from 'src/types/request.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  async signin(user: UserPayload) {
    const payload: JwtPayload = { sub: user.id, username: user.username };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signup(signupDto: SignupDto) {
    // todo: move to .env
    const saltRounds = 10;
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
