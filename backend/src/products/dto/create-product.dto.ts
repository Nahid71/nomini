import { IsString, IsNumber, IsOptional, Min, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Nomini Estate Single-Origin Organic Black Pepper (250g)' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Single-estate whole black pepper cultivated in Dinajpur.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 12.50 })
  @IsNumber()
  @IsPositive()
  priceUSD: number;

  @ApiProperty({ example: 350 })
  @IsNumber()
  @Min(0)
  stockQty: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'Organic Spices' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'NOM-SPICE-PEP-250G' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 'Nomini Agro Zone, Fulbari, Dinajpur, Bangladesh' })
  @IsOptional()
  @IsString()
  originFarm?: string;

  @ApiPropertyOptional({ example: 'BATCH-NOM-2026-001' })
  @IsOptional()
  @IsString()
  batchId?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

