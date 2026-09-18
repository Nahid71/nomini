import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Categories')
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product categories with sub-categories and product counts (Public)' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID (Public)' })
  @ApiResponse({ status: 200, description: 'Category details' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new product category (Admin & Staff)' })
  @ApiResponse({ status: 201, description: 'Category created' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category by ID (Admin & Staff)' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category by ID (Admin only)' })
  @ApiResponse({ status: 204, description: 'Category deleted' })
  async deleteCategory(@Param('id') id: string) {
    await this.categoriesService.deleteCategory(id);
    return;
  }

  @Post(':categoryId/subcategories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create sub-category under category (Admin & Staff)' })
  @ApiResponse({ status: 201, description: 'Sub-category created' })
  createSubCategory(
    @Param('categoryId') categoryId: string,
    @Body() dto: CreateSubCategoryDto,
  ) {
    return this.categoriesService.createSubCategory(categoryId, dto);
  }

  @Patch('subcategories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update sub-category by ID (Admin & Staff)' })
  @ApiResponse({ status: 200, description: 'Sub-category updated' })
  updateSubCategory(@Param('id') id: string, @Body() dto: UpdateSubCategoryDto) {
    return this.categoriesService.updateSubCategory(id, dto);
  }

  @Delete('subcategories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete sub-category by ID (Admin only)' })
  @ApiResponse({ status: 204, description: 'Sub-category deleted' })
  async deleteSubCategory(@Param('id') id: string) {
    await this.categoriesService.deleteSubCategory(id);
    return;
  }
}
