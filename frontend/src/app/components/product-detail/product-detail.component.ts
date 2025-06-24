import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { faShoppingBag, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [CommonModule, FontAwesomeModule, NavbarComponent, RouterLink]
})
export class ProductDetailComponent implements OnInit {
  faArrowCircleLeft = faArrowCircleLeft;
  product: Product | null = null;
  faShoppingBag = faShoppingBag;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.product = this.productService.getSelectedProduct(); // Add this line
    if (!this.product) {
      console.error('No product data found');
    }
  }

  addToCart(productId: number) {
    console.log(`Add product with ID: ${productId} to cart`);
    // Add your add to cart logic here
  }
}