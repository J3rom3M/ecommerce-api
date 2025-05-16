import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user/user';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async findById(id: number): Promise<User | null> {
  return this.userRepository.findOne({ where: { id } });
}

  async login(email: string, password: string) {
    const logger = new Logger('UsersService'); // Instancie le logger
    logger.log(`Tentative de connexion de l'utilisateur: ${email}`);
  
    try {
      const user = await this.validateUser(email, password);
      if (!user) {
        logger.warn(`Échec de connexion: Identifiants invalides pour ${email}`);
        throw new Error('Invalid credentials');
      }
  
      logger.log(`Connexion réussie pour: ${email}`);
      return { access_token: this.jwtService.sign({ id: user.id, email: user.email }) };
    } catch (error) {
      logger.error(`Erreur lors de la connexion de ${email}: ${error.message}`);
      throw error;
    }
  }
}
