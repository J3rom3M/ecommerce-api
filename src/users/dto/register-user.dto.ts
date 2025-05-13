import { IsEmail, IsString, MinLength } from 'class-validator';
import { Matches } from 'class-validator';


export class RegisterUserDto {
  @Matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/, { message: 'Le mot de passe doit contenir une majuscule, un chiffre et au moins 6 caractères.' })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}