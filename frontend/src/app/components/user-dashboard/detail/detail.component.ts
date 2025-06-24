import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../notification/notification.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  imports: [CommonModule, FontAwesomeModule, FormsModule, NotificationComponent]
})
export class DetailComponent implements OnInit {
  product: Product | undefined;
  faShoppingBag = faShoppingBag;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(Number(productId)).subscribe(
        (product: Product | undefined) => {
          this.product = product;
        },
        (error: any) => {
          console.error('Error fetching product:', error);
        }
      );
    }
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.successMessage = 'Item added to Cart';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Item already added to cart. Please remove it first';
        setTimeout(() => this.errorMessage = null, 3000);
        console.error('Error adding product to cart:', error);
      }
    });
  }

  buyNow(productId: number) {
    // Buy now logic
  }

  closeNotification() {
    this.errorMessage = null;
    this.successMessage = null;
  }
}