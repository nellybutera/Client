// src/modules/auth/dto/register.dto.ts
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  // and removed from the body payload in the actual service logic for safety.
  // We'll keep it optional here but ignore it in the service register method.
  @IsOptional()
  role?: 'CUSTOMER' | 'ADMIN'; 
}