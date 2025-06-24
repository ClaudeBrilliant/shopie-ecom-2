import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../../services/cart.service';
import { ProfileService } from '../../../services/profile.service';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.css']
})
export class DashboardNavbarComponent implements OnInit {
  faSearch = faSearch;
  faShoppingCart = faShoppingCart;
  searchTerm: string = '';
  cartItemCount: number = 0;
  userName: string = '';

  constructor(private cartService: CartService, private profileService: ProfileService, private searchService: SearchService) {}

  ngOnInit() {
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });

    this.profileService.getUserProfile().subscribe(profile => {
      this.userName = profile.name;
    });
  }

  handleSearch() {
    this.searchService.setSearchTerm(this.searchTerm);  // Correct method name
  }

  onFocus() {
    // Handle focus event if needed
  }

  onBlur() {
    // Handle blur event if needed
  }
}