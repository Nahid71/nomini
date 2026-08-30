import { IsString, IsNotEmpty, IsOptional, IsDateString, IsObject, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateBatchDto {
  @ApiProperty({ example: 'BATCH-NOM-2026-005' })
  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @ApiPropertyOptional({ example: 'Plot Alpha-1 (Fulbari Agro Zone, Dinajpur)' })
  @IsOptional()
  @IsString()
  farmPlot?: string;

  @ApiProperty({ example: '2026-08-28T08:00:00.000Z' })
  @IsDateString()
  harvestDate: string;

  @ApiPropertyOptional({ example: '25.4988° N, 88.8892° E' })
  @IsOptional()
  @IsString()
  geoCoordinates?: string;

  @ApiPropertyOptional({ example: 'https://nominigroup.com/reports/BATCH-NOM-2026-005.pdf' })
  @IsOptional()
  @IsString()
  labReportUrl?: string;

  @ApiPropertyOptional({
    example: {
      carbonRating: 'A+',
      netEmissionsKg: '-2.10 kg CO2e / kg',
      waterConservation: '98.6% via Solar Drip Irrigation',
      organicCertified: true,
      certificationBody: 'ISO 22000 & Halal Certified',
      pesticideFree: '100% Zero Synthetic Pesticides',
      soilHealthIndex: 97,
    },
  })
  @IsOptional()
  @IsObject()
  sustainability?: any;

  @ApiPropertyOptional({
    example: [
      {
        step: 1,
        date: '2026-03-05',
        title: 'Bio-Compost Soil Conditioning',
        description: 'Applied 25,000 MT organic compost',
        operator: 'Md. Rubel Hossain',
        location: 'Fulbari Agro Zone',
        status: 'COMPLETED',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  timeline?: any[];
}

export class UpdateBatchDto extends PartialType(CreateBatchDto) {}

export class AddTimelineStepDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  step?: number;

  @ApiProperty({ example: '2026-08-28' })
  @IsString()
  date: string;

  @ApiProperty({ example: 'Harvest & Sorting' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Carefully sorted and cold-stored.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Md. Rubel Hossain' })
  @IsOptional()
  @IsString()
  operator?: string;

  @ApiPropertyOptional({ example: 'Fulbari Processing Mill' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'COMPLETED' })
  @IsOptional()
  @IsString()
  status?: string;
}

