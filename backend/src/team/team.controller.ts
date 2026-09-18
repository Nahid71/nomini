import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './dto/create-team-member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Team')
@Controller('api/v1/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'List all team members (Public)' })
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single team member details (Public)' })
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new team member (Admin only)' })
  @ApiResponse({ status: 201, description: 'Team member successfully created' })
  create(@Body() dto: CreateTeamMemberDto) {
    return this.teamService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update team member name, title, image, position (Admin only)' })
  @ApiResponse({ status: 200, description: 'Team member successfully updated' })
  update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.teamService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a team member (Admin only)' })
  @ApiResponse({ status: 200, description: 'Team member successfully deleted' })
  delete(@Param('id') id: string) {
    return this.teamService.delete(id);
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder team members position (Admin only)' })
  reorder(@Body() body: { items: { id: string; order: number }[] }) {
    return this.teamService.reorder(body.items);
  }
}

