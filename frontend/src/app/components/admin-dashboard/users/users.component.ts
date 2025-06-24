import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserService } from '../../../services/admin/admin-user.service';
import { NotificationComponent } from '../../notification/notification.component';
import { ConfirmAlertComponent } from '../../confirm-alert/confirm-alert.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [CommonModule, NotificationComponent, ConfirmAlertComponent, FontAwesomeModule]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' = 'success';
  showConfirmDelete: boolean = false;
  userIdToDelete: number | null = null;
  faTrash = faTrash;
  confirmMessage: string = 'Are you sure you want to delete this user?';

  constructor(private adminUserService: AdminUserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminUserService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  confirmDeleteUser(userId: number) {
    this.userIdToDelete = userId;
    this.showConfirmDelete = true;
  }

  deleteUser() {
    if (this.userIdToDelete !== null) {
      this.adminUserService.deleteUser(this.userIdToDelete).subscribe({
        next: () => {
          this.loadUsers();
          this.notificationMessage = 'User deleted successfully';
          this.notificationType = 'success';
          this.showConfirmDelete = false;
          this.userIdToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.notificationMessage = 'Error deleting user';
          this.notificationType = 'error';
          this.showConfirmDelete = false;
          this.userIdToDelete = null;
        }
      });
    }
  }

  closeNotification() {
    this.notificationMessage = null;
  }

  cancelDelete() {
    this.showConfirmDelete = false;
    this.userIdToDelete = null;
  }
}