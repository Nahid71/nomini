import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        categoryRef: true,
        subCategory: true,
        batch: {
          select: {
            id: true,
            batchNumber: true,
            harvestDate: true,
            farmPlot: true,
            sustainability: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categoryRef: true,
        subCategory: true,
        batch: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    let resolvedBatchId: string | undefined = undefined;

    if (dto.batchId) {
      const batch = await this.prisma.batch.findFirst({
        where: {
          OR: [{ id: dto.batchId }, { batchNumber: dto.batchId }],
        },
      });
      if (batch) {
        resolvedBatchId = batch.id;
      }
    }

    let categoryName = dto.category;
    let subCategoryName = dto.subCategoryName;

    if (dto.categoryId) {
      const cat = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
      if (cat) {
        categoryName = cat.name;
      }
    }

    if (dto.subCategoryId) {
      const subCat = await this.prisma.subCategory.findUnique({ where: { id: dto.subCategoryId } });
      if (subCat) {
        subCategoryName = subCat.name;
      }
    }

    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        priceUSD: dto.priceUSD,
        stockQty: dto.stockQty,
        imageUrl: dto.imageUrl,
        category: categoryName,
        subCategoryName: subCategoryName,
        categoryId: dto.categoryId,
        subCategoryId: dto.subCategoryId,
        sku: dto.sku || `SKU-NOM-${Date.now().toString(36).toUpperCase()}`,
        originFarm: dto.originFarm,
        batchId: resolvedBatchId,
      },
      include: {
        categoryRef: true,
        subCategory: true,
        batch: true,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    let resolvedBatchId: string | null | undefined = undefined;

    if (dto.batchId !== undefined) {
      if (dto.batchId) {
        const batch = await this.prisma.batch.findFirst({
          where: {
            OR: [{ id: dto.batchId }, { batchNumber: dto.batchId }],
          },
        });
        resolvedBatchId = batch ? batch.id : null;
      } else {
        resolvedBatchId = null;
      }
    }

    let categoryName = dto.category;
    let subCategoryName = dto.subCategoryName;

    if (dto.categoryId) {
      const cat = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
      if (cat) {
        categoryName = cat.name;
      }
    }

    if (dto.subCategoryId) {
      const subCat = await this.prisma.subCategory.findUnique({ where: { id: dto.subCategoryId } });
      if (subCat) {
        subCategoryName = subCat.name;
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.priceUSD !== undefined && { priceUSD: dto.priceUSD }),
        ...(dto.stockQty !== undefined && { stockQty: dto.stockQty }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(categoryName !== undefined && { category: categoryName }),
        ...(subCategoryName !== undefined && { subCategoryName }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.subCategoryId !== undefined && { subCategoryId: dto.subCategoryId }),
        ...(dto.sku !== undefined && { sku: dto.sku }),
        ...(dto.originFarm !== undefined && { originFarm: dto.originFarm }),
        ...(resolvedBatchId !== undefined && { batchId: resolvedBatchId }),
      },
      include: {
        categoryRef: true,
        subCategory: true,
        batch: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
