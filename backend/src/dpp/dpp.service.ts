import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto, UpdateBatchDto, AddTimelineStepDto } from './dto/create-batch.dto';

@Injectable()
export class DppService {
  constructor(private prisma: PrismaService) {}

  async getBatchPassport(batchIdOrNumber: string) {
    // Look up by batchNumber or id
    const batch = await this.prisma.batch.findFirst({
      where: {
        OR: [
          { batchNumber: batchIdOrNumber },
          { id: batchIdOrNumber },
        ],
      },
      include: {
        product: true,
      },
    });

    if (!batch) {
      throw new NotFoundException(`Digital Product Passport for batch '${batchIdOrNumber}' not found`);
    }

    return {
      success: true,
      data: {
        id: batch.id,
        batchNumber: batch.batchNumber,
        farmPlot: batch.farmPlot,
        harvestDate: batch.harvestDate,
        geoCoordinates: batch.geoCoordinates,
        labReportUrl: batch.labReportUrl,
        sustainability: batch.sustainability,
        timeline: batch.timeline,
        product: batch.product
          ? {
              id: batch.product.id,
              title: batch.product.title,
              description: batch.product.description,
              priceUSD: Number(batch.product.priceUSD),
              stockQty: batch.product.stockQty,
              imageUrl: batch.product.imageUrl,
              sku: batch.product.sku,
              originFarm: batch.product.originFarm,
            }
          : null,
      },
    };
  }

  async getAllBatches() {
    return this.prisma.batch.findMany({
      include: {
        product: {
          select: {
            id: true,
            title: true,
            priceUSD: true,
            imageUrl: true,
            stockQty: true,
          },
        },
      },
      orderBy: { harvestDate: 'desc' },
    });
  }

  async createBatch(dto: CreateBatchDto) {
    const existing = await this.prisma.batch.findUnique({
      where: { batchNumber: dto.batchNumber },
    });

    if (existing) {
      throw new ConflictException(`Batch with number '${dto.batchNumber}' already exists`);
    }

    const defaultSustainability = {
      carbonRating: 'A+',
      netEmissionsKg: '-1.50 kg CO2e / kg',
      waterConservation: '97.5% via Solar Drip & Rainwater',
      organicCertified: true,
      certificationBody: 'ISO 22000 & HACCP Certified Bangladesh',
      pesticideFree: '100% Zero Synthetic Pesticides',
      soilHealthIndex: 96,
    };

    return this.prisma.batch.create({
      data: {
        batchNumber: dto.batchNumber,
        farmPlot: dto.farmPlot || 'Fulbari Agro Zone, Dinajpur',
        harvestDate: new Date(dto.harvestDate),
        geoCoordinates: dto.geoCoordinates || '25.4988° N, 88.8892° E',
        labReportUrl: dto.labReportUrl,
        sustainability: dto.sustainability || defaultSustainability,
        timeline: dto.timeline || [
          {
            step: 1,
            date: new Date(dto.harvestDate).toISOString().split('T')[0],
            title: 'Harvest & Verification Completed',
            description: 'Harvested under certified organic protocols at Nomini Group farms.',
            operator: 'Nomini Operations Lead',
            location: dto.farmPlot || 'Fulbari Agro Zone',
            status: 'COMPLETED',
          },
        ],
      },
    });
  }

  async updateBatch(batchIdOrNumber: string, dto: UpdateBatchDto) {
    const existing = await this.prisma.batch.findFirst({
      where: {
        OR: [{ id: batchIdOrNumber }, { batchNumber: batchIdOrNumber }],
      },
    });

    if (!existing) {
      throw new NotFoundException(`Batch '${batchIdOrNumber}' not found`);
    }

    return this.prisma.batch.update({
      where: { id: existing.id },
      data: {
        ...(dto.batchNumber && { batchNumber: dto.batchNumber }),
        ...(dto.farmPlot !== undefined && { farmPlot: dto.farmPlot }),
        ...(dto.harvestDate && { harvestDate: new Date(dto.harvestDate) }),
        ...(dto.geoCoordinates !== undefined && { geoCoordinates: dto.geoCoordinates }),
        ...(dto.labReportUrl !== undefined && { labReportUrl: dto.labReportUrl }),
        ...(dto.sustainability !== undefined && { sustainability: dto.sustainability }),
        ...(dto.timeline !== undefined && { timeline: dto.timeline }),
      },
      include: {
        product: true,
      },
    });
  }

  async addTimelineStep(batchIdOrNumber: string, stepDto: AddTimelineStepDto) {
    const existing = await this.prisma.batch.findFirst({
      where: {
        OR: [{ id: batchIdOrNumber }, { batchNumber: batchIdOrNumber }],
      },
    });

    if (!existing) {
      throw new NotFoundException(`Batch '${batchIdOrNumber}' not found`);
    }

    const currentTimeline = Array.isArray(existing.timeline) ? (existing.timeline as any[]) : [];
    const newStep = {
      step: stepDto.step || currentTimeline.length + 1,
      date: stepDto.date,
      title: stepDto.title,
      description: stepDto.description || '',
      operator: stepDto.operator || 'Nomini QA Team',
      location: stepDto.location || existing.farmPlot || 'Fulbari, Dinajpur',
      status: stepDto.status || 'COMPLETED',
    };

    const updatedTimeline = [...currentTimeline, newStep];

    return this.prisma.batch.update({
      where: { id: existing.id },
      data: {
        timeline: updatedTimeline,
      },
    });
  }

  async deleteBatch(batchIdOrNumber: string) {
    const existing = await this.prisma.batch.findFirst({
      where: {
        OR: [{ id: batchIdOrNumber }, { batchNumber: batchIdOrNumber }],
      },
    });

    if (!existing) {
      throw new NotFoundException(`Batch '${batchIdOrNumber}' not found`);
    }

    return this.prisma.batch.delete({
      where: { id: existing.id },
    });
  }
}
