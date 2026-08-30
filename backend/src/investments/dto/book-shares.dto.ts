import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookSharesDto {
  @ApiProperty({ example: 'project-uuid-1' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 10, description: 'Number of farm shares to book' })
  @IsInt()
  @Min(1)
  sharesBooked: number;

  @ApiPropertyOptional({ example: 'WISE_TRANSFER', default: 'WISE_TRANSFER' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
