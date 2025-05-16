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
  console.log('Payload reçu dans JwtStrategy:', payload);
  const user = await this.usersService.findById(payload.id);
  if (!user) throw new UnauthorizedException();
  console.log('Payload JWT reçu:', payload)
  return { id: payload.id, email: payload.email, role: payload.role }; // ✅ Assurer un typage correct - Retourne l'utilisateur validé
}
}