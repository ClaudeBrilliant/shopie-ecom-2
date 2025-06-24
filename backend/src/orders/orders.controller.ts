import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dtos';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() dto: CreateOrderDto,
    @Request() req: { user: { id: string } },
  ) {
    const userId = req.user.id;
    return await this.orderService.createOrder(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyOrders(@Request() req: { user: { id: string } }) {
    const userId = req.user.id;
    return await this.orderService.getUserOrders(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllOrders() {
    return await this.orderService.getAllOrders();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrderById(@Param('id') orderId: string) {
    return await this.orderService.getOrderById(orderId);
  }
}
