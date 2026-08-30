import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CreateStaffDto } from './dto/create-staff.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getEmployees() {
    return this.prisma.user.findMany({
      where: {
        role: {
          in: [Role.EMPLOYEE, Role.FARM_OPERATOR, Role.ADMIN],
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        _count: {
          select: {
            assignedTasks: true,
          },
        },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createStaff(dto: CreateStaffDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException(`User with email '${dto.email}' already exists`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        fullName: dto.fullName,
        role: dto.role,
        department: dto.department,
        avatarUrl: dto.avatarUrl,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return user;
  }

  async deleteUser(userId: string, currentAdminId: string) {
    if (userId === currentAdminId) {
      throw new BadRequestException('Cannot delete your own active administrator account');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { success: true, message: `User '${user.fullName}' removed successfully` };
  }
}

