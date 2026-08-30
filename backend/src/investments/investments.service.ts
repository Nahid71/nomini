import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookSharesDto } from './dto/book-shares.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateFinancialPlanDto } from './dto/update-financial-plan.dto';
import { Prisma } from '@prisma/client';

const DEFAULT_FINANCIAL_PLAN = {
  title: '$800,000 Commercial Agriculture Project',
  totalPoolUSD: 800000,
  useOfFunds: [
    { area: 'Land development & preparation', amount: 500000, percent: 62.65, desc: '500-hectare site conditioning & boundary zoning in Fulbari' },
    { area: 'Farm machinery & equipment', amount: 100000, percent: 12.50, desc: 'Modern tillers, decorticators, solar pumps & automated harvesters' },
    { area: 'Seeds, seedlings & planting materials', amount: 50000, percent: 6.25, desc: 'High-yield certified grains, cardamom & spice cultivars' },
    { area: 'Working capital & contingency reserve', amount: 50000, percent: 6.25, desc: 'Operational liquidity buffer and seasonal risk reserve' },
    { area: 'Fertilizer & crop protection', amount: 30000, percent: 3.75, desc: 'Organic bio-fertilizer digestate & bio-pest control' },
    { area: 'Labor & staff costs', amount: 20000, percent: 2.50, desc: 'Skilled agricultural technicians and agronomy supervisors' },
    { area: 'Storage, processing & packaging', amount: 20000, percent: 2.50, desc: 'Solar dehydration facilities and hermetic grain silos' },
    { area: 'Transportation & market development', amount: 15000, percent: 1.86, desc: 'Cold-chain distribution vehicles and off-taker channels' },
    { area: 'Irrigation & water infrastructure', amount: 10000, percent: 1.25, desc: 'Sub-surface solar drip lines & rainwater catchment' },
    { area: 'Administration & training', amount: 5000, percent: 0.62, desc: 'Farmer capacity building & ISO certification compliance' },
  ],
  projections: [
    { year: 'Year 1 (2026)', sales: 200000, costs: 100000, profit: 100000, margin: '50.0%' },
    { year: 'Year 2 (2027)', sales: 350000, costs: 150000, profit: 200000, margin: '57.1%' },
    { year: 'Year 3 (2028)', sales: 600000, costs: 200000, profit: 400000, margin: '66.7%' },
  ],
  riskMitigation: [
    'Climate & Extreme Weather: Climate-resilient seeds, automated drainage, and solar drip irrigation.',
    'Pests & Crop Diseases: Integrated Bio-Pest Management and continuous LoRaWAN IoT telemetry.',
    'Market Volatility: Advance buyer contracts and cold-chain storage to avoid harvest price dips.',
    'Financial Protection: Phased capital injection with a dedicated $50,000 emergency reserve.',
  ],
  investorRewards: [
    'Direct Farmer Empowerment: Over 10,000 contract farming households receiving guaranteed buybacks.',
    'National Food Security: Reliable domestic supply of pure organic grains, fish, dairy, and spices.',
    'High-Value Exports: EU & US FDA export processing unlocking premium foreign exchange margins.',
    'Asset-Backed Equity: Capital invested into tangible farmland, solar arrays, and high-tech biofloc tanks.',
  ],
};

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  async bookShares(bookSharesDto: BookSharesDto, userId: string) {
    const project = await this.prisma.crowdfarmProject.findUnique({
      where: { id: bookSharesDto.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Crowdfarming project with ID ${bookSharesDto.projectId} not found`);
    }

    if (project.availableShares < bookSharesDto.sharesBooked) {
      throw new BadRequestException(
        `Not enough shares available. Requested: ${bookSharesDto.sharesBooked}, Available: ${project.availableShares}`,
      );
    }

    const totalPaid = project.sharePrice.mul(bookSharesDto.sharesBooked);
    const certificateSerial = `NOM-CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const certificateUrl = `https://nomini.group/certificates/${certificateSerial}.pdf`;

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create investment
      const investment = await tx.investment.create({
        data: {
          userId,
          projectId: project.id,
          sharesBooked: bookSharesDto.sharesBooked,
          totalPaidUSD: totalPaid,
          certificateUrl,
          status: 'ISSUED',
        },
        include: {
          project: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      // 2. Update project stats
      await tx.crowdfarmProject.update({
        where: { id: project.id },
        data: {
          availableShares: { decrement: bookSharesDto.sharesBooked },
          raisedAmount: { increment: totalPaid },
        },
      });

      return investment;
    });

    return {
      success: true,
      message: `Successfully booked ${bookSharesDto.sharesBooked} shares in ${project.title}`,
      certificate: {
        serialNumber: certificateSerial,
        certificateUrl: result.certificateUrl,
        sharesBooked: result.sharesBooked,
        sharePriceUSD: Number(result.project.sharePrice),
        totalPaidUSD: Number(result.totalPaidUSD),
        investorName: result.user.fullName,
        investorEmail: result.user.email,
        projectName: result.project.title,
        expectedRoi: result.project.expectedRoi,
        issuedAt: result.createdAt,
      },
      investment: result,
    };
  }

  async getAllProjects() {
    return this.prisma.crowdfarmProject.findMany({
      include: {
        _count: {
          select: { investments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectById(id: string) {
    const project = await this.prisma.crowdfarmProject.findUnique({
      where: { id },
      include: {
        investments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async createProject(dto: CreateProjectDto) {
    return this.prisma.crowdfarmProject.create({
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        targetAmount: dto.targetAmount,
        raisedAmount: dto.raisedAmount || 0,
        sharePrice: dto.sharePrice,
        totalShares: dto.totalShares,
        availableShares: dto.availableShares,
        expectedRoi: dto.expectedRoi,
        harvestCycle: dto.harvestCycle,
        imageUrl: dto.imageUrl,
      },
    });
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    const existing = await this.prisma.crowdfarmProject.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const data: Prisma.CrowdfarmProjectUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.targetAmount !== undefined) data.targetAmount = dto.targetAmount;
    if (dto.raisedAmount !== undefined) data.raisedAmount = dto.raisedAmount;
    if (dto.sharePrice !== undefined) data.sharePrice = dto.sharePrice;
    if (dto.totalShares !== undefined) data.totalShares = dto.totalShares;
    if (dto.availableShares !== undefined) data.availableShares = dto.availableShares;
    if (dto.expectedRoi !== undefined) data.expectedRoi = dto.expectedRoi;
    if (dto.harvestCycle !== undefined) data.harvestCycle = dto.harvestCycle;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;

    return this.prisma.crowdfarmProject.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: string) {
    const existing = await this.prisma.crowdfarmProject.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Delete associated investments first if any
    await this.prisma.investment.deleteMany({
      where: { projectId: id },
    });

    return this.prisma.crowdfarmProject.delete({
      where: { id },
    });
  }

  async getUserInvestments(userId: string) {
    return this.prisma.investment.findMany({
      where: { userId },
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ----------------------------------------------------
  // Financial Plan & Allocation Management
  // ----------------------------------------------------

  async getFinancialPlan() {
    let plan = await this.prisma.financialPlan.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!plan) {
      // Seed default plan into DB
      plan = await this.prisma.financialPlan.create({
        data: {
          title: DEFAULT_FINANCIAL_PLAN.title,
          totalPoolUSD: DEFAULT_FINANCIAL_PLAN.totalPoolUSD,
          useOfFunds: DEFAULT_FINANCIAL_PLAN.useOfFunds,
          projections: DEFAULT_FINANCIAL_PLAN.projections,
          riskMitigation: DEFAULT_FINANCIAL_PLAN.riskMitigation,
          investorRewards: DEFAULT_FINANCIAL_PLAN.investorRewards,
        },
      });
    }

    return plan;
  }

  async updateFinancialPlan(dto: UpdateFinancialPlanDto) {
    let plan = await this.prisma.financialPlan.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!plan) {
      return this.prisma.financialPlan.create({
        data: {
          title: dto.title || DEFAULT_FINANCIAL_PLAN.title,
          totalPoolUSD: dto.totalPoolUSD || DEFAULT_FINANCIAL_PLAN.totalPoolUSD,
          useOfFunds: dto.useOfFunds || DEFAULT_FINANCIAL_PLAN.useOfFunds,
          projections: dto.projections || DEFAULT_FINANCIAL_PLAN.projections,
          riskMitigation: dto.riskMitigation || DEFAULT_FINANCIAL_PLAN.riskMitigation,
          investorRewards: dto.investorRewards || DEFAULT_FINANCIAL_PLAN.investorRewards,
        },
      });
    }

    const data: Prisma.FinancialPlanUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.totalPoolUSD !== undefined) data.totalPoolUSD = dto.totalPoolUSD;
    if (dto.useOfFunds !== undefined) data.useOfFunds = dto.useOfFunds;
    if (dto.projections !== undefined) data.projections = dto.projections;
    if (dto.riskMitigation !== undefined) data.riskMitigation = dto.riskMitigation;
    if (dto.investorRewards !== undefined) data.investorRewards = dto.investorRewards;

    return this.prisma.financialPlan.update({
      where: { id: plan.id },
      data,
    });
  }
}

