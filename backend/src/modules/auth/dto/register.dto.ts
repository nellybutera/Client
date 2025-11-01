import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'test@customer.com', description: 'The email address of the user.' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'P@ssword123', description: 'The user\'s password (min 8 chars).' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
  
  // Add other properties like name, if applicable
  @ApiProperty({ example: 'John Doe', description: 'The user\'s full name.' })
  @IsString()
  readonly name: string;
}