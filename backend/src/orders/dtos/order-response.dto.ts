import { OrderStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

export class OrderItemResponse {
  @Expose()
  id: string;

  @Expose()
  productId: string;

  @Expose()
  quantity: number;

  @Expose()
  price: number;
}

export class OrderResponseDto {
  @Expose()
  id: string;

  @Expose()
  totalAmount: number;

  @Expose()
  status: OrderStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  userId: string;

  @Expose()
  @Type(() => OrderItemResponse)
  orderItems: OrderItemResponse[];
}
