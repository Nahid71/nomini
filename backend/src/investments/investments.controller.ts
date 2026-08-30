import {
  Controller,
  Post,
  Patch,
  Delete,
  Put,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';
import { BookSharesDto } from './dto/book-shares.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateFinancialPlanDto } from './dto/update-financial-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Investments')
@Controller('api/v1/investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  /**
   * Section 7 Endpoint: POST /api/v1/investments/book
   * Auth Level: Investor & Admin
   */
  @Post('book')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INVESTOR, Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Books farm investment shares (Investor & Admin roles)' })
  @ApiResponse({ status: 201, description: 'Shares booked and digital certificate generated' })
  async bookShares(@Request() req: any, @Body() bookSharesDto: BookSharesDto) {
    return this.investmentsService.bookShares(bookSharesDto, req.user.id);
  }

  @Get('projects')
  @ApiOperation({ summary: 'List all active Crowdfarming projects (Public)' })
  async getAllProjects() {
    return this.investmentsService.getAllProjects();
  }

  @Get('projects/:id')
  @ApiOperation({ summary: 'Get details of a specific Crowdfarming project' })
  async getProjectById(@Param('id') id: string) {
    return this.investmentsService.getProjectById(id);
  }

  @Post('projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Crowdfarming Co-Ownership Project (Admin only)' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.investmentsService.createProject(createProjectDto);
  }

  @Patch('projects/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Crowdfarming Co-Ownership Project (Admin only)' })
  async updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.investmentsService.updateProject(id, updateProjectDto);
  }

  @Delete('projects/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Crowdfarming Co-Ownership Project (Admin only)' })
  async deleteProject(@Param('id') id: string) {
    return this.investmentsService.deleteProject(id);
  }

  @Get('my-investments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get portfolio of investments for the authenticated investor' })
  async getMyInvestments(@Request() req: any) {
    return this.investmentsService.getUserInvestments(req.user.id);
  }

  @Get('financial-plan')
  @ApiOperation({ summary: 'Get the official Financial Plan, Allocations & 3-Year Projections (Public)' })
  async getFinancialPlan() {
    return this.investmentsService.getFinancialPlan();
  }

  @Put('financial-plan')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the Financial Plan, Allocations & 3-Year Projections (Admin only)' })
  async updateFinancialPlan(@Body() updateDto: UpdateFinancialPlanDto) {
    return this.investmentsService.updateFinancialPlan(updateDto);
  }
}

