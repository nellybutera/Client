// src/modules/loan/dto/loan-request.dto.ts

import { IsNumber, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoanRequestDto {
  @ApiProperty({ example: 5000, description: 'The total amount of the loan requested.' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly amountRequested!: number;

  @ApiProperty({ example: 12, description: 'The term of the loan in months (e.g., 6, 12, 24).' })
  @IsNumber()
  @Min(3) // Minimum 3 months term
  @IsNotEmpty()
  readonly termMonths!: number;

  @ApiProperty({ example: 'To consolidate high-interest debt.', description: 'The stated purpose for the loan.' })
  @IsString()
  @IsNotEmpty()
  readonly purpose!: string;
}