import { Controller, Post, Body, Get, Param, UseGuards, Request, Optional } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Orders')
@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Section 7 Endpoint: POST /api/v1/orders/checkout
   * Auth Level: Customer (Authenticated or guest checkout with customer credentials)
   * Description: Executes e-commerce order payment
   */
  @Post('checkout')
  @ApiOperation({ summary: 'Executes e-commerce order payment' })
  @ApiResponse({ status: 201, description: 'Order created, stock decremented, and receipt generated' })
  async checkout(@Body() checkoutDto: CheckoutDto, @Request() req: any) {
    const userId = req.user?.id || null;
    return this.ordersService.checkout(checkoutDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders for the current user or all orders for Admin' })
  async getOrders(@Request() req: any) {
    return this.ordersService.getOrders(req.user.role === 'ADMIN' ? undefined : req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }
}
