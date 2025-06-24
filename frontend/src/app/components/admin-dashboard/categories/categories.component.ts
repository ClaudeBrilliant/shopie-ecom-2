import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminCategoryService } from '../../../services/admin/category.service';
import { NotificationComponent } from '../../notification/notification.component';
import { ConfirmAlertComponent } from '../../confirm-alert/confirm-alert.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [NotificationComponent, ConfirmAlertComponent, CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  categoryForm: FormGroup;
  showForm: boolean = false;
  editMode: boolean = false;
  categoryId: number | null = null;
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' = 'success';
  showConfirmDelete: boolean = false;
  confirmMessage: string = '';
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;

  constructor(private fb: FormBuilder, private categoryService: AdminCategoryService) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  onAddCategory() {
    this.showForm = true;
    this.editMode = false;
    this.categoryForm.reset();
  }

  onSaveCategory() {
    if (this.categoryForm.valid) {
      const categoryName = this.categoryForm.value.name;
      if (this.editMode && this.categoryId) {
        this.categoryService.updateCategory(this.categoryId, categoryName).subscribe({
          next: () => {
            this.notificationMessage = 'Category updated successfully';
            this.notificationType = 'success';
            this.loadCategories();
            this.showForm = false;
          },
          error: (error) => {
            console.error('Error updating category:', error);
            this.notificationMessage = 'Error updating category';
            this.notificationType = 'error';
          }
        });
      } else {
        this.categoryService.createCategory(categoryName).subscribe({
          next: () => {
            this.notificationMessage = 'Category created successfully';
            this.notificationType = 'success';
            this.loadCategories();
            this.showForm = false;
          },
          error: (error) => {
            console.error('Error creating category:', error);
            this.notificationMessage = 'Error creating category';
            this.notificationType = 'error';
          }
        });
      }
    }
  }

  onEditCategory(category: any) {
    this.showForm = true;
    this.editMode = true;
    this.categoryId = category.id;
    this.categoryForm.patchValue(category);
  }

  onDeleteCategory(id: number) {
    this.showConfirmDelete = true;
    this.confirmMessage = 'Are you sure you want to delete this category?';
    this.categoryId = id;
  }

  confirmDeleteCategory() {
    if (this.categoryId) {
      this.categoryService.deleteCategory(this.categoryId).subscribe({
        next: () => {
          this.notificationMessage = 'Category deleted successfully';
          this.notificationType = 'success';
          this.loadCategories();
          this.showConfirmDelete = false;
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.notificationMessage = 'Error deleting category';
          this.notificationType = 'error';
        }
      });
    }
  }

  cancelDelete() {
    this.showConfirmDelete = false;
    this.categoryId = null;
  }

  closeNotification() {
    this.notificationMessage = null;
  }

  onCancel() {
    this.showForm = false;
    this.categoryForm.reset();
  }
}