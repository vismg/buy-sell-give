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

export interface RequestQuery<T = string> {
  query: T;
}
