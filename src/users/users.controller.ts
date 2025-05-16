import { Controller, Post, Get, Body, UsePipes, UseGuards, ValidationPipe, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard'; // 🛡️ Import du guard
import { Roles } from '../common/decorators/roles.decorator'; // 🎭 Import du décorateur
import { Role } from '../common/enums/role.enum'; // 🎭 Import de l'enum des rôles

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string; role: string };
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() body: RegisterUserDto) {
    console.log('Données reçues:', body);
    return this.usersService.register(body.email, body.password);
  }  

  @Post('login')
  login(@Body() body: RegisterUserDto) {
    return this.usersService.login(body.email, body.password);
  }

  // ✅ Route protégée : accès au compte utilisateur réservé aux "user"
  @UseGuards(AuthGuard('jwt'), RolesGuard) // 🛡️ Ajout du guard des rôles
  @Roles(Role.USER) // 🎭 Seuls les utilisateurs ayant le rôle "user" peuvent accéder à cette route
  @Get('account')
  async getProfile(@Req() request: AuthenticatedRequest) {
    console.log('Utilisateur récupéré:', request.user);
    if (!request.user) throw new UnauthorizedException();
    return request.user;
  }
}