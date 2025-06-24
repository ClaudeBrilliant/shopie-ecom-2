export class CartItemResponseDto {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export class CartResponseDto {
  items: CartItemResponseDto[];
  totalPrice: number;
  totalQuantity: number;
}
