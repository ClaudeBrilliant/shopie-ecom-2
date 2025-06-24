/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getPrismaClient } from 'src/config/prisma.config';
import { CreateOrderDto } from './dtos/create-order.dtos';

@Injectable()
export class OrderService {
  private prisma = getPrismaClient();

  async createOrder(userId: string, dto: CreateOrderDto) {
    try {
      // 1. Get product info from DB to avoid price tampering
      const productIds = dto.items.map((item) => item.productId);
      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds }, isActive: true },
      });

      if (products.length !== dto.items.length) {
        throw new NotFoundException('One or more products not found');
      }

      // 2. Build orderItems and recalculate totalAmount
      let serverTotal = 0;
      const orderItems = dto.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }

        const itemTotal = product.price * item.quantity;
        serverTotal += itemTotal;

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price, // Lock product price at order time
        };
      });

      // 3. Create order with verified total
      const order = await this.prisma.order.create({
        data: {
          userId,
          totalAmount: serverTotal,
          status: 'PENDING',
          orderItems: { create: orderItems },
        },
        include: {
          orderItems: true,
        },
      });

      // 4. Clear cart after order is placed
      await this.prisma.cartItem.deleteMany({ where: { userId } });

      return order;
    } catch (error) {
      throw new InternalServerErrorException(
        `Order creation failed: ${error.message}`,
      );
    }
  }

  async getAllOrders() {
    try {
      return await this.prisma.order.findMany({
        include: {
          orderItems: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  async getOrderById(orderId: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
          user: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      return order;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch order');
    }
  }

  async getUserOrders(userId: string) {
    try {
      return await this.prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user orders');
    }
  }
}
