import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token manquant');
    }

    const [, token] = authHeader.split(' '); // Récupère le token après "Bearer"

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // Ajoute l'utilisateur à la requête
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
}