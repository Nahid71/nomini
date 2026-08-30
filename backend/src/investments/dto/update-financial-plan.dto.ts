import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFinancialPlanDto {
  @ApiPropertyOptional({ example: '$800,000 Commercial Agriculture Project' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 800000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPoolUSD?: number;

  @ApiPropertyOptional({
    example: [
      {
        area: 'Land development & preparation',
        amount: 500000,
        percent: 62.65,
        desc: '500-hectare site conditioning & boundary zoning in Fulbari',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  useOfFunds?: any[];

  @ApiPropertyOptional({
    example: [
      { year: 'Year 1 (2026)', sales: 200000, costs: 100000, profit: 100000, margin: '50.0%' },
    ],
  })
  @IsArray()
  @IsOptional()
  projections?: any[];

  @ApiPropertyOptional({ example: ['Climate & Extreme Weather: Climate-resilient seeds...'] })
  @IsArray()
  @IsOptional()
  riskMitigation?: string[];

  @ApiPropertyOptional({ example: ['Direct Farmer Empowerment: Over 10,000 contract households...'] })
  @IsArray()
  @IsOptional()
  investorRewards?: string[];
}

