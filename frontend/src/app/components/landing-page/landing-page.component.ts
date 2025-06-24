import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  imports: [NavbarComponent, FormsModule, CommonModule]
})
export class LandingPageComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategoryId: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products.slice(0, 6); // Show only the first 6 products
        this.filteredProducts = this.products; // Show all products by default
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }


  initSlider() {
    const wrapper = document.querySelector(".sliderWrapper") as HTMLElement;
    const menuItems = document.querySelectorAll(".menuItem");

    if (wrapper && menuItems.length) {
      menuItems.forEach((item, index) => {
        item.addEventListener("click", () => {
          wrapper.style.transform = `translateX(${-100 * index}vw)`;
        });
      });
    }
  }

  initPaymentModal() {
    const productButton = document.querySelector(".productButton") as HTMLElement;
    const payment = document.querySelector(".payment") as HTMLElement;
    const close = document.querySelector(".close") as HTMLElement;

    if (productButton && payment && close) {
      productButton.addEventListener("click", () => {
        payment.style.display = "flex";
      });
      close.addEventListener("click", () => {
        payment.style.display = "none";
      });
    }
  }
}