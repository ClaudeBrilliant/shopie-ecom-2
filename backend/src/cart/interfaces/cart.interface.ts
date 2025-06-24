export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}
