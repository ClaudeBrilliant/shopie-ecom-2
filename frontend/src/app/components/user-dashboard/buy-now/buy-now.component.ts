import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCamera, faMobileAlt, faLaptop, faHeadphonesAlt, faGamepad, faTv, faTshirt, faCookie, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { SearchService } from '../../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buy-now',
  standalone: true,
  templateUrl: './buy-now.component.html',
  styleUrls: ['./buy-now.component.css'],
  imports: [CommonModule, FontAwesomeModule, FormsModule, RouterModule, MatPaginatorModule, MatCardModule]
})
export class BuyNowComponent implements OnInit, OnDestroy {
  faCamera = faCamera;
  faMobileAlt = faMobileAlt;
  faLaptop = faLaptop;
  faHeadphonesAlt = faHeadphonesAlt;
  faGamepad = faGamepad;
  faTv = faTv;
  faTshirt = faTshirt;
  faCookie = faCookie;
  faShoppingBag = faShoppingBag;

  categories = [
    { id: 1, name: 'Camera', icon: this.faCamera },
    { id: 2, name: 'Phones', icon: this.faMobileAlt },
    { id: 3, name: 'Laptops', icon: this.faLaptop },
    { id: 7, name: 'Clothes', icon: this.faTshirt },
    { id: 5, name: 'Gaming', icon: this.faGamepad },
    { id: 6, name: 'Screens', icon: this.faTv },
    { id: 7, name: 'Clothes', icon: this.faTshirt },
    { id: 8, name: 'Cookies', icon: this.faCookie },
    { id: 6, name: 'Screens', icon: this.faTv },
    { id: 8, name: 'Cookies', icon: this.faCookie },
  ];

  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  selectedCategoryId: number | null = null;
  currentPage: number = 0;
  itemsPerPage: number = 6;
  totalProducts: number = 0;
  private searchSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService, private searchService: SearchService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products || []; // Ensure it's always an array
        this.filteredProducts = [...this.products]; // Create a copy
        this.totalProducts = this.filteredProducts.length;
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching products:', error);
        // Set empty arrays on error to prevent undefined issues
        this.products = [];
        this.filteredProducts = [];
        this.totalProducts = 0;
        this.updatePagination();
      }
    );

    this.searchSubscription = this.searchService.getSearchTerm().subscribe(term => {
      this.applySearchFilter(term);
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  filterProducts(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    
    // Ensure products is an array before filtering
    if (!Array.isArray(this.products)) {
      this.filteredProducts = [];
    } else if (categoryId !== null) {
      this.filteredProducts = this.products.filter(product => product.categoryId === categoryId);
    } else {
      this.filteredProducts = [...this.products];
    }
    
    this.currentPage = 0;
    this.totalProducts = this.filteredProducts.length;
    this.updatePagination();
  }

  applySearchFilter(term: string) {
    // Ensure products is an array before filtering
    if (!Array.isArray(this.products)) {
      this.filteredProducts = [];
    } else if (term && term.trim()) {
      this.filteredProducts = this.products.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.products];
    }
    
    this.currentPage = 0;
    this.totalProducts = this.filteredProducts.length;
    this.updatePagination();
  }

  updatePagination() {
    // Add safety check to ensure filteredProducts is an array
    if (!Array.isArray(this.filteredProducts)) {
      this.filteredProducts = [];
    }
    
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.updatePagination();
  }
}