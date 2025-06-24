import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    RouterLink, 
    NavbarComponent, 
    FontAwesomeModule, 
    NotificationComponent
  ], // Removed duplicate NavbarComponent
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  faArrowCircleLeft = faArrowCircleLeft;
  
  user: Partial<User> = {
    email: '',
    password: '',
    name: '',
    phone: '', // Good - you added this correctly
    role: 'CUSTOMER',
  };
  
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' = 'success';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    // Optional: Add basic validation before sending to service
    if (!this.user.name || !this.user.email || !this.user.phone || !this.user.password) {
      this.notificationType = 'error';
      this.notificationMessage = 'Please fill in all required fields';
      return;
    }

    this.userService.register(this.user).subscribe({
      next: (response) => {
        this.notificationType = 'success';
        this.notificationMessage = 'Registered Successfully';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000); // redirect after 3 seconds
      },
      error: (error) => {
        this.notificationType = 'error';
        this.notificationMessage = 'Error Registering User. Try Again';
        console.error('Registration error:', error); // For debugging
      }
    });
  }

  closeNotification() {
    this.notificationMessage = null;
  }
}