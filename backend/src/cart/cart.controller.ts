/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartItemDto } from './dtos/update-cart.dto';
import { RemoveFromCartDto } from './dtos/remove-from-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateCartDto } from './dtos/create-cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Req() req, @Body() dto: CreateCartDto) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, dto);
  }

  @Get()
  async getCart(@Req() req) {
    const userId = req.user.id;
    return this.cartService.getCart(userId);
  }

  @Patch('update')
  async updateCartItem(@Req() req, @Body() dto: UpdateCartItemDto) {
    const userId = req.user.id;
    return this.cartService.updateItemQuantity(userId, dto);
  }

  @Delete('remove')
  async removeFromCart(@Req() req, @Body() dto: RemoveFromCartDto) {
    const userId = req.user.id;
    return this.cartService.removeFromCart(userId, dto);
  }

  @Delete('clear')
  async clearCart(@Req() req) {
    const userId = req.user.id;
    return this.cartService.clearCart(userId);
  }
}
