import { IsEmail, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { Matches } from 'class-validator';


export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{14,}$/, { message: 'Le mot de passe doit contenir une majuscule, un chiffre, un caractère spécial et au moins 14 caractères.' })
  password: string;
}