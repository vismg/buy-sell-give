import { User } from 'src/users/entities/user.entity';

export interface JwtPayload {
  sub: number;
  username: string;
}

export interface UserPayload {
  id: number;
  username: string;
}

export interface RequestWithUserPayload {
  user: UserPayload;
}

export interface RequestWithUser {
  user: User;
}

export interface RequestQuery<T = string> {
  query: T;
}
