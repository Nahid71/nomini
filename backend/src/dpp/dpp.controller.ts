import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DppService } from './dpp.service';
import { CreateBatchDto, UpdateBatchDto, AddTimelineStepDto } from './dto/create-batch.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('DPP')
@Controller('api/v1/dpp')
export class DppController {
  constructor(private readonly dppService: DppService) {}

  /**
   * Section 7 Endpoint: GET /api/v1/dpp/passport/:batchId
   * Auth Level: Public
   * Description: Returns supply chain lifecycle data for QR view
   */
  @Get('passport/:batchId')
  @ApiOperation({ summary: 'Returns supply chain lifecycle data for QR view (Public)' })
  @ApiResponse({ status: 200, description: 'DPP Batch data with timeline & sustainability metrics' })
  async getBatchPassport(@Param('batchId') batchId: string) {
    return this.dppService.getBatchPassport(batchId);
  }

  @Get('batches')
  @ApiOperation({ summary: 'List all batches in the platform (Public)' })
  async getAllBatches() {
    return this.dppService.getAllBatches();
  }

  @Post('batches')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.FARM_OPERATOR)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new DPP batch (Admin & Employee)' })
  @ApiResponse({ status: 201, description: 'Batch successfully created' })
  async createBatch(@Body() createBatchDto: CreateBatchDto) {
    return this.dppService.createBatch(createBatchDto);
  }

  @Patch('batches/:batchNumber')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.FARM_OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing DPP batch (Admin & Employee)' })
  @ApiResponse({ status: 200, description: 'Batch successfully updated' })
  async updateBatch(
    @Param('batchNumber') batchNumber: string,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    return this.dppService.updateBatch(batchNumber, updateBatchDto);
  }

  @Post('batches/:batchNumber/timeline')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.FARM_OPERATOR)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new timeline milestone to a batch (Admin & Employee)' })
  @ApiResponse({ status: 201, description: 'Timeline step added' })
  async addTimelineStep(
    @Param('batchNumber') batchNumber: string,
    @Body() stepDto: AddTimelineStepDto,
  ) {
    return this.dppService.addTimelineStep(batchNumber, stepDto);
  }

  @Delete('batches/:batchNumber')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a DPP batch (Admin only)' })
  @ApiResponse({ status: 204, description: 'Batch successfully deleted' })
  async deleteBatch(@Param('batchNumber') batchNumber: string) {
    await this.dppService.deleteBatch(batchNumber);
    return;
  }
}
