import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-alert',
  standalone: true,
  templateUrl: './confirm-alert.component.html',
  styleUrls: ['./confirm-alert.component.css'],
  imports: [CommonModule]
})
export class ConfirmAlertComponent {
  @Input() message: string = 'Are you sure you want to proceed?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}