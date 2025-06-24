import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faShoppingBag, 
  faClipboardList, 
  faShoppingCart, 
  faUser, 
  faStar, 
  faSignOutAlt,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  faShoppingBag = faShoppingBag;
  faClipboardList = faClipboardList;
  faShoppingCart = faShoppingCart;
  faUser = faUser;
  faStar = faStar;
  faSignOutAlt = faSignOutAlt;
  faQuestionCircle = faQuestionCircle
  cartItemCount: number = 0;



  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

}