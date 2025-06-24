import { OrderStatus, OrderItem } from '@prisma/client';

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  userId: string;
  orderItems?: OrderItem[];
}
