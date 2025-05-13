import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';

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
}