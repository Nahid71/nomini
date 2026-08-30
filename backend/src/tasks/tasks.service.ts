import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-status.dto';
import { Role, TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasksForUser(user: { id: string; role: Role }, employeeIdFilter?: string, statusFilter?: TaskStatus) {
    const whereClause: any = {};

    // RBAC logic: Admins can see all tasks or filter by employee. Employees/Operators see their own assigned tasks.
    if (user.role === Role.ADMIN) {
      if (employeeIdFilter) {
        whereClause.assignedTo = employeeIdFilter;
      }
    } else {
      whereClause.assignedTo = user.id;
    }

    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    return this.prisma.task.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            department: true,
            avatarUrl: true,
          },
        },
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async getTaskById(id: string, user: { id: string; role: Role }) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            department: true,
            avatarUrl: true,
          },
        },
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (user.role !== Role.ADMIN && task.assignedTo !== user.id) {
      throw new ForbiddenException('You do not have permission to view this task');
    }

    return task;
  }

  async assignTask(createTaskDto: CreateTaskDto, managerId: string) {
    // Validate that assignee exists and is an employee or operator
    const employee = await this.prisma.user.findUnique({
      where: { id: createTaskDto.assignedTo },
    });

    if (!employee) {
      throw new NotFoundException(`Assigned employee with ID ${createTaskDto.assignedTo} not found`);
    }

    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status || TaskStatus.TODO,
        priority: createTaskDto.priority || 'MEDIUM',
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        assignedTo: createTaskDto.assignedTo,
        assignedBy: managerId,
      },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            department: true,
            avatarUrl: true,
          },
        },
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async updateTaskStatus(id: string, updateStatusDto: UpdateTaskStatusDto, user: { id: string; role: Role }) {
    const existingTask = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Role check: Employee can only update their own assigned tasks. Admin can update any.
    if (user.role !== Role.ADMIN && existingTask.assignedTo !== user.id) {
      throw new ForbiddenException('You are not authorized to update tasks assigned to other employees');
    }

    const completedAt =
      updateStatusDto.status === TaskStatus.COMPLETED
        ? new Date()
        : updateStatusDto.status !== existingTask.status && existingTask.status === TaskStatus.COMPLETED
        ? null
        : existingTask.completedAt;

    return this.prisma.task.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
        completedAt,
      },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            department: true,
            avatarUrl: true,
          },
        },
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async deleteTask(id: string) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async getTaskStats() {
    const total = await this.prisma.task.count();
    const todo = await this.prisma.task.count({ where: { status: TaskStatus.TODO } });
    const inProgress = await this.prisma.task.count({ where: { status: TaskStatus.IN_PROGRESS } });
    const inReview = await this.prisma.task.count({ where: { status: TaskStatus.IN_REVIEW } });
    const completed = await this.prisma.task.count({ where: { status: TaskStatus.COMPLETED } });

    return {
      total,
      todo,
      inProgress,
      inReview,
      completed,
    };
  }
}
