/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getPrismaClient } from 'src/config/prisma.config';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
  private prisma = getPrismaClient();

  async createProduct(data: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({ data });
      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create product: ${error.message}`,
      );
    }
  }

  async getAllProducts() {
    try {
      return await this.prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async getProductById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          cartItems: true,
          orderItems: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return await this.prisma.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async softDeleteProduct(id: string) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return await this.prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
