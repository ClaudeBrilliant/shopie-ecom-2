import { UserRole, Order, CartItem, PasswordReset } from '@prisma/client';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date | null;

  profileImageId?: string | null;
  profileImageUrl?: string | null;

  // Optional address
  address?: string | null;

  // Relationships
  orders: Order[];
  cartItems: CartItem[];
  passwordResets?: PasswordReset[];
}
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date | null;

  profileImageId?: string | null;
  profileImageUrl?: string | null;

  // Optional address
  address?: string | null;

  // Relationships
  ordersCount: number;
  cartItemsCount: number;
}
