export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: 'ADMIN' | 'CUSTOMER';
  phone?: string;
  profileImageId?: string;
  profileImageUrl?: string;
  password?: string;
  isActive?: boolean;
}
