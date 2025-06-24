import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../notification/notification.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component'; // Import the new component

interface Order {
  id: number;
  createdAt: Date;
  status: string;
  total: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule, NotificationComponent, ConfirmationDialogComponent] // Add the new component to imports
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' = 'success';
  orderToCancel: number | null = null; // Track the order to cancel

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders.map(order => ({ ...order, status: 'Pending' }));
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  confirmCancelOrder(orderId: number) {
    this.orderToCancel = orderId;
  }

  onConfirm() {
    if (this.orderToCancel !== null) {
      this.orderService.cancelOrder(this.orderToCancel).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order.id !== this.orderToCancel);
          this.notificationMessage = 'Order cancelled successfully';
          this.notificationType = 'success';
          this.orderToCancel = null;
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.notificationMessage = 'Error cancelling order';
          this.notificationType = 'error';
          this.orderToCancel = null;
        }
      });
    }
  }

  onCancel() {
    this.orderToCancel = null;
  }

  closeNotification() {
    this.notificationMessage = null;
  }
}