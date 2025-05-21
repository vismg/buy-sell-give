import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/types/request.types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    const user = await this.authService.signup(body);

    return this.authService.signin(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  signin(@Req() req: RequestWithUser) {
    return this.authService.signin(req.user);
  }
}
