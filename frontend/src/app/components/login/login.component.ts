import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/login.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { NotificationComponent } from '../notification/notification.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, NotificationComponent, NavbarComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  faArrowRight = faArrowRight;
  faArrowCircleLeft = faArrowCircleLeft;
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false; // Add loading state

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.isLoading = true; // Start loading
    this.errorMessage = null; // Clear previous errors

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        
        // The token storage is now handled in the AuthService
        // Get the role from the stored data
        const role = this.authService.getRole();
        
        console.log('User role:', role);
        
        // Navigate based on role
        if (role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'CUSTOMER') {
          this.router.navigate(['/user-dashboard']);
        } else {
          // Default navigation if role is not recognized
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;
        
        // Check if we actually got logged in despite the error (backend issue)
        if (this.authService.isLoggedIn()) {
          console.log('Token found despite error, redirecting...');
          const role = this.authService.getRole();
          
          if (role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/user-dashboard']);
          }
        } else {
          // Show appropriate error message
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password. Please try again.';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to the server. Please check your connection.';
          } else {
            this.errorMessage = 'Login failed. Please try again later.';
          }
        }
      }
    });
  }

  closeNotification() {
    this.errorMessage = null;
  }

  // Helper methods for template
  get isEmailInvalid() {
    const emailControl = this.loginForm.get('email');
    return emailControl?.invalid && (emailControl?.dirty || emailControl?.touched);
  }

  get isPasswordInvalid() {
    const passwordControl = this.loginForm.get('password');
    return passwordControl?.invalid && (passwordControl?.dirty || passwordControl?.touched);
  }
}