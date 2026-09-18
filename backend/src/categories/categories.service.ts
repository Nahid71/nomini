import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto/create-category.dto';

const DEFAULT_CATEGORIES = [
  {
    name: 'Organic Spices',
    slug: 'organic-spices',
    description: 'High-potency single-estate whole spices from Fulbari and Dinajpur agro zones.',
    order: 0,
    subCategories: [
      { name: 'Black Pepper', slug: 'black-pepper', description: 'Whole sun-dried black peppercorns.' },
      { name: 'Cardamom & Cinnamon', slug: 'cardamom-cinnamon', description: 'Aromatic green cardamom & organic Ceylon cinnamon.' },
      { name: 'Organic Turmeric & Ginger', slug: 'turmeric-ginger', description: 'Curcumin-rich pure turmeric roots and dried sliced ginger.' },
      { name: 'Chili & Blends', slug: 'chili-blends', description: 'Export-grade dry chili and artisanal spice mixes.' },
    ],
  },
  {
    name: 'Seafood & Aquaculture',
    slug: 'seafood-aquaculture',
    description: 'Biofloc and RAS raised export-grade shrimp and freshwater harvests.',
    order: 1,
    subCategories: [
      { name: 'Black Tiger Shrimp', slug: 'black-tiger-shrimp', description: 'Grade-A headless and whole Black Tiger Shrimp.' },
      { name: 'Biofloc Tilapia & Carp', slug: 'biofloc-tilapia-carp', description: 'Live and frozen fresh harvest fish.' },
      { name: 'Aquaculture Feed & Supplements', slug: 'aquaculture-feed', description: 'Probiotic and high-protein floating fish feeds.' },
    ],
  },
  {
    name: 'Gourmet Oils & Botanicals',
    slug: 'gourmet-oils-botanicals',
    description: 'Single-source cold-pressed virgin oils and superfood botanical powders.',
    order: 2,
    subCategories: [
      { name: 'Cold-Pressed Virgin Oils', slug: 'cold-pressed-virgin-oils', description: 'First cold-pressed mustard, sesame, and sunflower oils.' },
      { name: 'Moringa & Superfoods', slug: 'moringa-superfoods', description: 'Certified organic moringa leaf and botanical powders.' },
      { name: 'Natural Sweeteners & Stevia', slug: 'stevia-sweeteners', description: 'Farm-cultivated stevia leaves and zero-calorie extracts.' },
    ],
  },
  {
    name: 'Dairy & Livestock',
    slug: 'dairy-livestock',
    description: 'Pure organic dairy, grass-fed cattle, and free-range products.',
    order: 3,
    subCategories: [
      { name: 'Organic Ghee & Butter', slug: 'organic-ghee-butter', description: 'Traditional bilona ghee and artisan butter.' },
      { name: 'Fresh Farm Milk & Yogurt', slug: 'fresh-milk-yogurt', description: 'Chilled pasteurized Holstein Friesian milk.' },
      { name: 'Scientific Cattle & Goat Feed', slug: 'cattle-goat-feed', description: 'Nutritionally balanced high-yield livestock feeds.' },
    ],
  },
  {
    name: 'Renewable Bio-Energy & Soil',
    slug: 'renewable-bio-energy-soil',
    description: 'Circular grid organic soil conditioners and bio-fertilizer.',
    order: 4,
    subCategories: [
      { name: 'Organic Bio-Fertilizer', slug: 'organic-bio-fertilizer', description: 'Microbiologically active 25,000 MT/yr granular bio-fertilizer.' },
      { name: 'Liquid Probiotic Soil Inoculants', slug: 'soil-inoculants', description: 'Bio-stimulants promoting rapid microbial root health.' },
      { name: 'Pelletized Biomass Fuel', slug: 'biomass-fuel', description: 'Compressed agri-waste eco-pellets for clean combustion.' },
    ],
  },
  {
    name: 'Eco-Bio Fiber',
    slug: 'eco-bio-fiber',
    description: 'Upcycled natural agro-waste fibers and sustainable yarns.',
    order: 5,
    subCategories: [
      { name: 'Banana Natural Fiber Yarn', slug: 'banana-fiber-yarn', description: 'Spun eco-textile yarn from banana pseudostems.' },
      { name: 'Pineapple & Hyacinth Textile', slug: 'pineapple-hyacinth-textile', description: 'Biodegradable handcraft bio-fibers and geotextiles.' },
    ],
  },
];

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async findAll() {
    const count = await this.prisma.category.count();
    if (count === 0) {
      await this.seedDefaults();
    }

    return this.prisma.category.findMany({
      include: {
        subCategories: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async createCategory(dto: CreateCategoryDto) {
    const slug = dto.slug ? this.generateSlug(dto.slug) : this.generateSlug(dto.name);

    const existing = await this.prisma.category.findFirst({
      where: { OR: [{ name: dto.name }, { slug }] },
    });
    if (existing) {
      throw new BadRequestException(`Category with name "${dto.name}" or slug already exists`);
    }

    let order = dto.order;
    if (order === undefined || order === null) {
      const maxOrder = await this.prisma.category.aggregate({ _max: { order: true } });
      order = (maxOrder._max.order ?? -1) + 1;
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        order,
      },
      include: {
        subCategories: true,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    const slug = dto.slug
      ? this.generateSlug(dto.slug)
      : dto.name
        ? this.generateSlug(dto.name)
        : undefined;

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(slug && { slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
      include: {
        subCategories: true,
      },
    });
  }

  async deleteCategory(id: string) {
    await this.findOne(id);
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async createSubCategory(categoryId: string, dto: CreateSubCategoryDto) {
    const category = await this.findOne(categoryId);

    const slug = dto.slug ? this.generateSlug(dto.slug) : this.generateSlug(dto.name);

    const existing = await this.prisma.subCategory.findFirst({
      where: { categoryId, name: dto.name },
    });
    if (existing) {
      throw new BadRequestException(
        `Sub-category "${dto.name}" already exists under category "${category.name}"`,
      );
    }

    let order = dto.order;
    if (order === undefined || order === null) {
      const maxOrder = await this.prisma.subCategory.aggregate({
        where: { categoryId },
        _max: { order: true },
      });
      order = (maxOrder._max.order ?? -1) + 1;
    }

    return this.prisma.subCategory.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        order,
        categoryId,
      },
    });
  }

  async updateSubCategory(id: string, dto: UpdateSubCategoryDto) {
    const subCat = await this.prisma.subCategory.findUnique({ where: { id } });
    if (!subCat) {
      throw new NotFoundException(`Sub-category with ID ${id} not found`);
    }

    const slug = dto.slug
      ? this.generateSlug(dto.slug)
      : dto.name
        ? this.generateSlug(dto.name)
        : undefined;

    return this.prisma.subCategory.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(slug && { slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
    });
  }

  async deleteSubCategory(id: string) {
    const subCat = await this.prisma.subCategory.findUnique({ where: { id } });
    if (!subCat) {
      throw new NotFoundException(`Sub-category with ID ${id} not found`);
    }

    return this.prisma.subCategory.delete({
      where: { id },
    });
  }

  private async seedDefaults() {
    for (const cat of DEFAULT_CATEGORIES) {
      const createdCat = await this.prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          order: cat.order,
          subCategories: {
            create: cat.subCategories.map((sub, idx) => ({
              name: sub.name,
              slug: sub.slug,
              description: sub.description,
              order: idx,
            })),
          },
        },
        include: { subCategories: true },
      });

      // Link any existing products that match this category name
      const matchingProducts = await this.prisma.product.findMany({
        where: {
          category: {
            contains: cat.name.split(' ')[0],
            mode: 'insensitive',
          },
          categoryId: null,
        },
      });

      for (const prod of matchingProducts) {
        const defaultSubCat = createdCat.subCategories[0];
        await this.prisma.product.update({
          where: { id: prod.id },
          data: {
            categoryId: createdCat.id,
            category: createdCat.name,
            subCategoryId: defaultSubCat ? defaultSubCat.id : null,
            subCategoryName: defaultSubCat ? defaultSubCat.name : null,
          },
        });
      }
    }
  }
}
