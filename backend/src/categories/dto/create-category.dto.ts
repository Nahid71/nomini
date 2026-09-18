import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Organic Spices' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'organic-spices' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'High-potency single-estate whole spices from Fulbari.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CreateSubCategoryDto {
  @ApiProperty({ example: 'Black Pepper' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'black-pepper' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Sun-dried high-piperine Tellicherry and local black pepper varieties.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}
