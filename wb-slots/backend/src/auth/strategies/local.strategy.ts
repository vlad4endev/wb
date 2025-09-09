import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Can be email or phone
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    const { phone } = req.body;
    const user = await this.authService.validateUser(email, phone, password);
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    return user;
  }
}
