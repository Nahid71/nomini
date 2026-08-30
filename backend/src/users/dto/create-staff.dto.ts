import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateStaffDto {
  @ApiProperty({ example: 'employee@nominigroup.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'NominiPass2026!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Md. Tariqul Islam' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ enum: [Role.ADMIN, Role.EMPLOYEE, Role.FARM_OPERATOR], default: Role.EMPLOYEE })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({ example: 'Aquaculture & Hatcheries' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

