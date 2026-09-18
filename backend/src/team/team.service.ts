import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './dto/create-team-member.dto';

const DEFAULT_TEAM_MEMBERS = [
  {
    name: 'Abu Bakar Siddique',
    role: 'Founder of Nomini Group',
    dept: 'Founder & Strategic Vision',
    avatar: '/team/abu-bakar-siddique.jpeg',
    badge: 'Founder',
    order: 0,
    isFounder: true,
  },
  {
    name: 'Md. Abdul Wares',
    role: 'President, CEO',
    dept: 'Executive Leadership & Operations',
    avatar: '/team/md-abdul-wares.jpeg',
    badge: 'Executive Board',
    order: 1,
    isFounder: false,
  },
  {
    name: 'MD. Shahadat Hossain',
    role: 'Vice President Finance',
    dept: 'Corporate Finance & Accounts',
    avatar: '/team/md-shahadat-hossain.jpeg',
    badge: 'Finance',
    order: 2,
    isFounder: false,
  },
  {
    name: 'MD. Anwar Hossain',
    role: 'Vice President Sales & Marketing',
    dept: 'Sales & Market Development',
    avatar: '/team/md-anwar-hossain.jpeg',
    badge: 'Commercial',
    order: 3,
    isFounder: false,
  },
  {
    name: 'Mynul Hassan',
    role: 'Vice President Sales',
    dept: 'Commercial & Distribution Sales',
    avatar: '/team/mynul-hassan.jpeg',
    badge: 'Sales',
    order: 4,
    isFounder: false,
  },
  {
    name: 'Md. Milon Sheikh',
    role: '1st Vice President (Sourcing)',
    dept: 'Procurement & Strategic Sourcing',
    avatar: '/team/md-milon-sheikh.jpeg',
    badge: 'Sourcing',
    order: 5,
    isFounder: false,
  },
  {
    name: 'Rakibul Islam Sourov',
    role: 'Director Sourcing',
    dept: 'Supply Chain & Sourcing Strategy',
    avatar: '/team/rakibul-islam-sourov.jpeg',
    badge: 'Supply Chain',
    order: 6,
    isFounder: false,
  },
  {
    name: 'Sandip Kumar Roy',
    role: 'Director & Manager',
    dept: 'Administration & Corporate Affairs',
    avatar: '/team/sandip-kumar-roy.jpeg',
    badge: 'Administration',
    order: 7,
    isFounder: false,
  },
  {
    name: 'Sakib Hasan Plabon',
    role: 'HR, Admin, Compliance & Sales Manager',
    dept: 'Human Resources & Regulatory Compliance',
    avatar: '/team/sakib-hasan-plabon.jpeg',
    badge: 'HR & Compliance',
    order: 8,
    isFounder: false,
  },
  {
    name: 'Md. Eliyas Ali Sumon',
    role: 'Medical Assistant & IT Manager',
    dept: 'Health, Safety & IT Systems',
    avatar: '/team/md-eliyas-ali-sumon.jpeg',
    badge: 'IT & Medical',
    order: 9,
    isFounder: false,
  },
  {
    name: 'Md. Alamin',
    role: 'Supervisor',
    dept: 'Field Operations & Plot Supervision',
    avatar: '/team/md-alamin.jpeg',
    badge: 'Operations',
    order: 10,
    isFounder: false,
  },
];

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    let count = await this.prisma.teamMember.count();
    if (count === 0) {
      for (const member of DEFAULT_TEAM_MEMBERS) {
        await this.prisma.teamMember.create({ data: member });
      }
    }

    return this.prisma.teamMember.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id },
    });
    if (!member) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }
    return member;
  }

  async create(dto: CreateTeamMemberDto) {
    // If no order provided, put at the end
    let order = dto.order;
    if (order === undefined || order === null) {
      const maxOrder = await this.prisma.teamMember.aggregate({
        _max: { order: true },
      });
      order = (maxOrder._max.order ?? -1) + 1;
    }

    return this.prisma.teamMember.create({
      data: {
        name: dto.name,
        role: dto.role,
        dept: dto.dept,
        avatar: dto.avatar,
        badge: dto.badge,
        order,
        isFounder: dto.isFounder ?? false,
      },
    });
  }

  async update(id: string, dto: UpdateTeamMemberDto) {
    await this.findOne(id);

    return this.prisma.teamMember.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.role !== undefined && { role: dto.role }),
        ...(dto.dept !== undefined && { dept: dto.dept }),
        ...(dto.avatar !== undefined && { avatar: dto.avatar }),
        ...(dto.badge !== undefined && { badge: dto.badge }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.isFounder !== undefined && { isFounder: dto.isFounder }),
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.teamMember.delete({
      where: { id },
    });
  }

  async reorder(items: { id: string; order: number }[]) {
    return this.prisma.$transaction(
      items.map((item) =>
        this.prisma.teamMember.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
  }
}

