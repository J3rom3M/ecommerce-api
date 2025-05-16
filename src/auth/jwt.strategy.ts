import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
    });
  }

async validate(payload: any) {
  console.log('Payload JWT reçu:', payload);
  const user = await this.usersService.findById(payload.id);
  if (!user) {
    console.log('Utilisateur non trouvé pour l’ID:', payload.id);
    throw new UnauthorizedException();
  }
  return { id: payload.id, email: payload.email, role: payload.role };
}

}