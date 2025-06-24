import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    const product = await this.productService.createProduct(dto);
    return {
      message: 'Product created successfully',
      data: product,
    };
  }

  @Get()
  async getAllProducts() {
    const products = await this.productService.getAllProducts();
    return {
      message: 'All products retrieved',
      data: products,
    };
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);
    return {
      message: 'Product retrieved',
      data: product,
    };
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = await this.productService.updateProduct(id, dto);
    return {
      message: 'Product updated successfully',
      data: product,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string) {
    await this.productService.softDeleteProduct(id);
  }
}
