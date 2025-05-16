import { Controller, Post, Get, Body, UsePipes, UseGuards, ValidationPipe, Req } from '@nestjs/common';
import { Request } from 'express'; // ✅ Importation nécessaire
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string; role: string }; // Typage de l'utilisateur
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

  // ✅ Route protégée : accès au compte utilisateur
@UseGuards(AuthGuard('jwt'))
@Get('account')
async getProfile(@Req() request: AuthenticatedRequest) {
  console.log('Utilisateur récupéré:', request.user);
  if (!request.user) throw new UnauthorizedException(); // Sécurisation en cas d'absence d'utilisateur
  return request.user;
}

}