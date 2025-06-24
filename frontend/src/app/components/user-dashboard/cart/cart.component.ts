import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { NotificationComponent } from '../../notification/notification.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, NotificationComponent, FontAwesomeModule]
})
export class CartComponent implements OnInit {
  faTrash = faTrash; 
  cartItems: any[] = [];
  totalPrice: number = 0;
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' = 'success';

  constructor(private cartService: CartService, private orderService: OrderService) {}

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartItems = cart.items;
        this.calculateTotalPrice();
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
      }
    });
  }

  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId).subscribe({
      next: (cart) => {
        this.cartItems = cart.items;
        this.calculateTotalPrice();
        this.notificationMessage = 'Product removed from cart';
        this.notificationType = 'success';
      },
      error: (error) => {
        console.error('Error removing product from cart:', error);
        this.notificationMessage = 'Error removing product from cart';
        this.notificationType = 'error';
      }
    });
  }

  placeOrder() {
    this.orderService.createOrder().subscribe({
      next: (order) => {
        this.cartItems = [];
        this.totalPrice = 0;
        this.notificationMessage = 'Order placed successfully';
        this.notificationType = 'success';
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.notificationMessage = 'Error placing order';
        this.notificationType = 'error';
      }
    });
  }

  closeNotification() {
    this.notificationMessage = null;
  }
}
