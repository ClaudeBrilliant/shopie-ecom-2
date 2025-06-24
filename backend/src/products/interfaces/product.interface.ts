import { CartItem, OrderItem } from '@prisma/client';

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description?: string | null;
  price: number;
  image: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  cartItems?: CartItem[];
  orderItems?: OrderItem[];
}
