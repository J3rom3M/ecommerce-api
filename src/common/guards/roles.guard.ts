import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface'; // ✅ Import correct

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true; // Si aucune restriction, autoriser l'accès

    const request: AuthenticatedRequest = context.switchToHttp().getRequest(); // ✅ Typage corrigé
    const user = request.user;

    console.log('Rôle utilisateur:', user?.role); // 🔍 Debugging    

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Accès refusé : rôle insuffisant');
    }

    return true;
  }
}