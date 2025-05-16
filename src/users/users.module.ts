import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user/user';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';

console.log('JWT Secret:', process.env.JWT_SECRET);
console.log('JWT Secret utilisé:', process.env.JWT_SECRET || 'fallback_secret');

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret', // Assure-toi que le secret est bien défini
      signOptions: { algorithm: 'HS256', expiresIn: '1h' },
    }),
  ],
  providers: [UsersService, JwtStrategy, RolesGuard],
  controllers: [UsersController],
})
export class UsersModule {}