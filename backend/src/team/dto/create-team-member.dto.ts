import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamMemberDto {
  @ApiProperty({ example: 'Abu Bakar Siddique', description: 'Full name of the team member' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Founder of Nomini Group', description: 'Role / Designation / Title' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiPropertyOptional({ example: 'Founder & Strategic Vision', description: 'Department or Scope' })
  @IsString()
  @IsOptional()
  dept?: string;

  @ApiProperty({ example: '/team/abu-bakar-siddique.jpeg', description: 'Avatar or image URL' })
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @ApiPropertyOptional({ example: 'Founder', description: 'Badge label' })
  @IsString()
  @IsOptional()
  badge?: string;

  @ApiPropertyOptional({ example: 0, description: 'Sort order / position (0 = top)' })
  @IsInt()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true, description: 'Whether member occupies the featured top founder spot' })
  @IsBoolean()
  @IsOptional()
  isFounder?: boolean;
}

export class UpdateTeamMemberDto {
  @ApiPropertyOptional({ example: 'Abu Bakar Siddique' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Founder of Nomini Group' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: 'Founder & Strategic Vision' })
  @IsString()
  @IsOptional()
  dept?: string;

  @ApiPropertyOptional({ example: '/team/abu-bakar-siddique.jpeg' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: 'Founder' })
  @IsString()
  @IsOptional()
  badge?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFounder?: boolean;
}
