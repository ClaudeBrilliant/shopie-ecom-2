export interface ProductResponseDto {
  id: string;
  name: string;
  shortDescription: string;
  description?: string;
  price: number;
  image: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
