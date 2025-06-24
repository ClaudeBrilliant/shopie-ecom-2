import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardNavbarComponent } from './dashboard-navbar/dashboard-navbar.component';
import { DetailComponent } from './detail/detail.component';
import { ProductDetailComponent } from "../product-detail/product-detail.component";
import { ProductsComponent } from "../admin-dashboard/products/products.component";

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  imports: [CommonModule, RouterModule, SidebarComponent, DashboardNavbarComponent, DetailComponent, ProductsComponent]
})
export class UserDashboardComponent {}