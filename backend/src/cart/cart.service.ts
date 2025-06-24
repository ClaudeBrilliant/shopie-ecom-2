import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getPrismaClient } from 'src/config/prisma.config';
import { UpdateCartItemDto } from './dtos/update-cart.dto';
import { RemoveFromCartDto } from './dtos/remove-from-cart.dto';
import { CreateCartDto } from './dtos/create-cart.dto';

@Injectable()
export class CartService {
  private prisma = getPrismaClient();

  async addToCart(userId: string, dto: CreateCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (!product.isActive || product.stockQuantity < dto.quantity) {
      throw new ConflictException('Not enough stock available');
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
    });

    if (existing) throw new ConflictException('Product already in cart');

    const [cartItem] = await this.prisma.$transaction([
      this.prisma.cartItem.create({
        data: {
          userId,
          productId: dto.productId,
          quantity: dto.quantity,
        },
        include: { product: true },
      }),
      this.prisma.product.update({
        where: { id: dto.productId },
        data: { stockQuantity: { decrement: dto.quantity } },
      }),
    ]);

    return cartItem;
  }

  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    const items = cartItems.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.image,
    }));

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      totalPrice,
      totalQuantity,
    };
  }

  async updateItemQuantity(userId: string, dto: UpdateCartItemDto) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
      include: { product: true },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    const quantityDiff = dto.quantity - cartItem.quantity;

    if (quantityDiff === 0) return cartItem;

    if (quantityDiff > 0 && cartItem.product.stockQuantity < quantityDiff) {
      throw new ConflictException('Not enough stock available');
    }

    const [updatedItem] = await this.prisma.$transaction([
      this.prisma.cartItem.update({
        where: {
          userId_productId: {
            userId,
            productId: dto.productId,
          },
        },
        data: { quantity: dto.quantity },
        include: { product: true },
      }),
      this.prisma.product.update({
        where: { id: dto.productId },
        data: {
          stockQuantity: {
            decrement: quantityDiff > 0 ? quantityDiff : 0,
            increment: quantityDiff < 0 ? Math.abs(quantityDiff) : 0,
          },
        },
      }),
    ]);

    return updatedItem;
  }

  async removeFromCart(userId: string, dto: RemoveFromCartDto) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.prisma.$transaction([
      this.prisma.product.update({
        where: { id: dto.productId },
        data: { stockQuantity: { increment: cartItem.quantity } },
      }),
      this.prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId,
            productId: dto.productId,
          },
        },
      }),
    ]);

    return { message: 'Item removed and stock restored' };
  }

  async clearCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      select: { productId: true, quantity: true },
    });

    if (cartItems.length === 0) {
      return { message: 'Cart already empty' };
    }

    const restockOps = cartItems.map((item) =>
      this.prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { increment: item.quantity } },
      }),
    );

    await this.prisma.$transaction([
      ...restockOps,
      this.prisma.cartItem.deleteMany({ where: { userId } }),
    ]);

    return { message: 'Cart cleared and stock restored' };
  }
}
