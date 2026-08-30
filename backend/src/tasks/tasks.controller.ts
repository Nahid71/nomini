import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, TaskStatus } from '@prisma/client';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Section 7 Endpoint: GET /api/v1/tasks
   * Auth Level: Employee / Admin / Farm Operator
   * Description: Fetches assigned tasks based on user role
   */
  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.FARM_OPERATOR)
  @ApiOperation({ summary: 'Fetches assigned tasks based on user role (Admin sees all / can filter; Employee sees their own)' })
  @ApiQuery({ name: 'employeeId', required: false, description: 'Optional employee ID filter for Admins' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus, description: 'Optional task status filter' })
  async getTasks(
    @Request() req: any,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: TaskStatus,
  ) {
    return this.tasksService.getTasksForUser(req.user, employeeId, status);
  }

  /**
   * Summary metrics for the Kanban board
   */
  @Get('stats')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.FARM_OPERATOR)
  @ApiOperation({ summary: 'Get summary statistics of tasks across status columns' })
  async getTaskStats() {
    return this.tasksService.getTaskStats();
  }

  /**
   * Section 7 Endpoint: POST /api/v1/tasks/assign
   * Auth Level: Admin
   * Description: Creates a new task and assigns to an employee
   */
  @Post('assign')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new task and assigns to an employee (Admin only)' })
  @ApiResponse({ status: 201, description: 'Task successfully created and assigned' })
  async assignTask(@Request() req: any, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.assignTask(createTaskDto, req.user.id);
  }

  /**
   * Section 7 Endpoint: PATCH /api/v1/tasks/:id/status
   * Auth Level: Employee / Admin / Farm Operator
   * Description: Updates task status (e.g., to COMPLETED)
   */
  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.FARM_OPERATOR)
  @ApiOperation({ summary: 'Updates task status (e.g., to COMPLETED / IN_PROGRESS)' })
  @ApiResponse({ status: 200, description: 'Task status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTaskStatusDto,
    @Request() req: any,
  ) {
    return this.tasksService.updateTaskStatus(id, updateStatusDto, req.user);
  }

  /**
   * Get single task details
   */
  @Get(':id')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.FARM_OPERATOR)
  @ApiOperation({ summary: 'Get details of a specific task by ID' })
  async getTaskById(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.getTaskById(id, req.user);
  }

  /**
   * Delete task (Admin only)
   */
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task (Admin only)' })
  async deleteTask(@Param('id') id: string) {
    await this.tasksService.deleteTask(id);
    return;
  }
}
