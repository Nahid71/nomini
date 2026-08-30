import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Inspect Plot Alpha-7 Soil Moisture Sensors' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Run calibration checks on IoT soil hygrometers across 12 zones.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'user-uuid-of-employee' })
  @IsString()
  @IsNotEmpty()
  assignedTo: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ example: 'HIGH', default: 'MEDIUM' })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ example: '2026-09-15T18:00:00Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
