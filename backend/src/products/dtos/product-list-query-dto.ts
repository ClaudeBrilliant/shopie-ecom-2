export interface ProductListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'stockQuantity';
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
}
