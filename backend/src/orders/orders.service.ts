import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(checkoutDto: CheckoutDto, userId?: string) {
    if (!checkoutDto.items || checkoutDto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Lookup products
    const productIds = checkoutDto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { batch: true },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products were not found');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalAmount = new Prisma.Decimal(0);
    const orderItemsData: { productId: string; quantity: number; priceUSD: Prisma.Decimal }[] = [];
    const purchasedBatches: { batchNumber: string; productTitle: string }[] = [];

    // Verify stock and calculate totals
    for (const item of checkoutDto.items) {
      const product = productMap.get(item.productId);
      if (!product) continue;

      if (product.stockQty < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.title}". Requested: ${item.quantity}, Available: ${product.stockQty}`,
        );
      }

      const itemTotal = product.priceUSD.mul(item.quantity);
      totalAmount = totalAmount.add(itemTotal);

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        priceUSD: product.priceUSD,
      });

      if (product.batch) {
        purchasedBatches.push({
          batchNumber: product.batch.batchNumber,
          productTitle: product.title,
        });
      }
    }

    // Execute order creation and stock decrement in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          userId: userId || null,
          customerEmail: checkoutDto.customerEmail.toLowerCase(),
          customerName: checkoutDto.customerName,
          shippingAddress: checkoutDto.shippingAddress,
          paymentMethod: checkoutDto.paymentMethod || 'STRIPE',
          status: 'PAID',
          totalUSD: totalAmount,
          items: {
            create: orderItemsData.map((it) => ({
              productId: it.productId,
              quantity: it.quantity,
              priceUSD: it.priceUSD,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: { batch: true },
              },
            },
          },
        },
      });

      // 2. Decrement stock
      for (const item of checkoutDto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQty: { decrement: item.quantity },
          },
        });
      }

      return newOrder;
    });

    return {
      success: true,
      message: 'Order processed and paid successfully',
      order: {
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        totalUSD: Number(order.totalUSD),
        status: order.status,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        items: order.items.map((it) => ({
          id: it.id,
          productTitle: it.product.title,
          priceUSD: Number(it.priceUSD),
          quantity: it.quantity,
          batchNumber: it.product.batch?.batchNumber || null,
          dppUrl: it.product.batch ? `/dpp/${it.product.batch.batchNumber}` : null,
        })),
        traceabilityPassports: purchasedBatches,
      },
    };
  }

  async getOrders(userId?: string) {
    const where = userId ? { userId } : {};
    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: { batch: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: { batch: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
}
