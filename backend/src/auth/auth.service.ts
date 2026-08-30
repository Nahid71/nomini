import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Restrict public registration to CUSTOMER and INVESTOR only
    const allowedRoles: Role[] = [Role.CUSTOMER, Role.INVESTOR];
    const targetRole = registerDto.role || Role.CUSTOMER;

    if (!allowedRoles.includes(targetRole)) {
      throw new ConflictException(
        'Public account registration is restricted to Customer and Investor roles only. Admin, Employee, and Operator accounts must be provisioned by an Administrator.',
      );
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: registerDto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email.toLowerCase(),
        password: hashedPassword,
        fullName: registerDto.fullName,
        role: targetRole,
        department: registerDto.department,
        avatarUrl: registerDto.avatarUrl,
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async getDemoUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        department: true,
        avatarUrl: true,
      },
      orderBy: { role: 'asc' },
    });

    // Generate JWT tokens for each demo user for effortless frontend switching
    return users.map((u) => ({
      ...u,
      token: this.jwtService.sign({
        sub: u.id,
        email: u.email,
        role: u.role,
        fullName: u.fullName,
      }),
    }));
  }
}
