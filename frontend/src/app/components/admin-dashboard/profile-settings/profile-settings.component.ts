import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { NotificationComponent } from '../../notification/notification.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [NotificationComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      }
    });
  }

  onUpdateProfile() {
    if (this.profileForm.valid) {
      this.profileService.updateUserProfile(this.profileForm.value.email, this.profileForm.value.name).subscribe({
        next: (response) => {
          this.notificationMessage = 'Profile updated successfully';
          this.notificationType = 'success';
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.notificationMessage = 'Error updating profile';
          this.notificationType = 'error';
        }
      });
    }
  }

  onUpdatePassword() {
    if (this.passwordForm.valid) {
      this.profileService.updateUserPassword(this.passwordForm.value.email, this.passwordForm.value.newPassword).subscribe({
        next: (response) => {
          this.notificationMessage = 'Password updated successfully';
          this.notificationType = 'success';
        },
        error: (error) => {
          console.error('Error updating password:', error);
          this.notificationMessage = 'Error updating password';
          this.notificationType = 'error';
        }
      });
    }
  }

  closeNotification() {
    this.notificationMessage = null;
  }
}