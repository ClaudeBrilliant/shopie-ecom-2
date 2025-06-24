import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="notification" [ngClass]="{ 'success': type === 'success', 'error': type === 'error', 'show': show }">
      <span class="message">{{ message }}</span>
      <fa-icon [icon]="faTimesCircle" (click)="closeNotification()" class="close-icon"></fa-icon>
    </div>
  `,
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  @Output() close = new EventEmitter<void>();
  show: boolean = false;
  faTimesCircle = faTimesCircle;

  ngOnInit() {
    setTimeout(() => {
      this.show = true;
    }, 10);
  }

  closeNotification() {
    this.show = false;
    setTimeout(() => {
      this.close.emit();
    }, 500);
  }
}