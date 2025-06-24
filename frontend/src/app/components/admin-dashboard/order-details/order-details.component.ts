import { Component, OnInit } from '@angular/core';
import { AdminOrdersService } from '../../../services/admin/admin-orders.service';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../notification/notification.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface Order {
  id: number;
  createdAt: Date;
  total: number;
  items: OrderItem[];
  userName: string;
  email: string;
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  imports: [CommonModule, NotificationComponent, FontAwesomeModule]
})
export class OrderDetailsComponent implements OnInit {
  orders: Order[] = [];
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' = 'success';
  faCheck = faCheck;

  constructor(private adminOrdersService: AdminOrdersService) {}

  ngOnInit() {
    this.adminOrdersService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  confirmOrder(orderId: number) {
    this.adminOrdersService.confirmOrder(orderId).subscribe({
      next: () => {
        this.notificationMessage = 'Order confirmed successfully';
        this.notificationType = 'success';
      },
      error: (error) => {
        console.error('Error confirming order:', error);
        this.notificationMessage = 'Error confirming order';
        this.notificationType = 'error';
      }
    });
  }

  closeNotification() {
    this.notificationMessage = null;
  }

  getTotalItems(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }
}