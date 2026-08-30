import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Nomini Fulbari Integrated Agro-Industrial Park' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Commercial 500-hectare precision agriculture expansion...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Fulbari, Dinajpur, Bangladesh' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 800000 })
  @IsNumber()
  @Min(0)
  targetAmount: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  raisedAmount?: number;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @Min(0.01)
  sharePrice: number;

  @ApiProperty({ example: 16000 })
  @IsNumber()
  @Min(1)
  totalShares: number;

  @ApiProperty({ example: 16000 })
  @IsNumber()
  @Min(0)
  availableShares: number;

  @ApiPropertyOptional({ example: '20.5% Annual Projected ROI' })
  @IsString()
  @IsOptional()
  expectedRoi?: string;

  @ApiPropertyOptional({ example: 'Continuous Multi-Crop Cycles' })
  @IsString()
  @IsOptional()
  harvestCycle?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

