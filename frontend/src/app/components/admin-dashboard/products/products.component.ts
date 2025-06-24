import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminProductService } from '../../../services/admin/admin-product.service';
import { NotificationComponent } from '../../notification/notification.component';
import { ConfirmAlertComponent } from '../../confirm-alert/confirm-alert.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NotificationComponent, ConfirmAlertComponent, CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, MatPaginatorModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  paginatedProducts: any[] = [];
  categories: any[] = [];
  productForm: FormGroup;
  showForm: boolean = false;
  editMode: boolean = false;
  productId: number | null = null;
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' = 'success';
  showConfirmDelete: boolean = false;
  confirmMessage: string = '';
  searchTerm: string = '';
  selectedCategoryId: string = '';
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faTimes = faTimes;
  faSearch = faSearch;
  itemsPerPage: number = 4;
  currentPage: number = 0;
  totalItems: number = 0;
  isLoading: boolean = false; // Added for loading state

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder, private productService: AdminProductService) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(7)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      // categoryId: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.totalItems = products.length;
        this.updatePagination();
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  updatePagination() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.updatePagination();
  }

  onAddProduct() {
    this.showForm = true;
    this.editMode = false;
    this.productForm.reset();
  }

  onSaveProduct() {
    if (this.productForm.valid) {
      if (this.editMode && this.productId) {
        this.productService.updateProduct(this.productId, this.productForm.value).subscribe({
          next: () => {
            this.notificationMessage = 'Product updated successfully';
            this.notificationType = 'success';
            this.loadProducts();
            this.showForm = false;
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.notificationMessage = 'Error updating product';
            this.notificationType = 'error';
          }
        });
      } else {
        this.productService.createProduct(this.productForm.value).subscribe({
          next: () => { 
            this.notificationMessage = 'Product created successfully';
            this.notificationType = 'success';
            this.loadProducts();
            this.showForm = false;
          },
          error: (error) => {
            console.error('Error creating product:', error);
            this.notificationMessage = 'Error creating product';
            this.notificationType = 'error';
          }
        });
      }
    }
  }

  onEditProduct(product: any) {
    this.showForm = true;
    this.editMode = true;
    this.productId = product.id;
    this.productForm.patchValue(product);
  }

  onDeleteProduct(id: number) {
    this.showConfirmDelete = true;
    this.confirmMessage = 'Are you sure you want to delete this product?';
    this.productId = id;
  }

  confirmDeleteProduct() {
    if (this.productId) {
      this.productService.deleteProduct(this.productId).subscribe({
        next: () => {
          this.notificationMessage = 'Product deleted successfully';
          this.notificationType = 'success';
          this.loadProducts();
          this.showConfirmDelete = false;
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.notificationMessage = 'Error deleting product';
          this.notificationType = 'error';
          this.showConfirmDelete = false;
        }
      });
    }
  }

  cancelDelete() {
    this.showConfirmDelete = false;
  }

  onCancel() {
    this.showForm = false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "t2gtalks");
      formData.append("cloud_name", "dtn9kzx2v");

      fetch('https://api.cloudinary.com/v1_1/dtn9kzx2v/image/upload', {
        method: "POST",
        body: formData
      }).then((res => res.json())).then(res => {
        this.productForm.patchValue({ image: res.url });
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false;
      });
    }
  }

  onSearch() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePagination();
  }

  onFilterByCategory() {
    if (this.selectedCategoryId) {
      this.filteredProducts = this.products.filter(product =>
        product.categoryId === parseInt(this.selectedCategoryId, 10)
      );
    } else {
      this.filteredProducts = this.products;
    }
    this.updatePagination();
  }

  closeNotification() {
    this.notificationMessage = null;
  }
}
