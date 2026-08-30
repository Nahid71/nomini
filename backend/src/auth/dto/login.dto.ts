import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@nomini.group' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'NominiAdmin2026!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
