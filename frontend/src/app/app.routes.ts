import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminGuard, AuthGuard } from './guards/auth.guard';
import { OrdersComponent } from './components/user-dashboard/orders/orders.component';
import { CartComponent } from './components/user-dashboard/cart/cart.component';
import { ReviwedProductsComponent } from './components/user-dashboard/reviwed-products/reviwed-products.component';
import { BuyNowComponent } from './components/user-dashboard/buy-now/buy-now.component';
import { DetailComponent } from './components/user-dashboard/detail/detail.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AnalyticsComponent } from './components/admin-dashboard/analytics/analytics.component';
import { ProductsComponent } from './components/admin-dashboard/products/products.component';
import { CategoriesComponent } from './components/admin-dashboard/categories/categories.component';
import { UsersComponent } from './components/admin-dashboard/users/users.component';
import { ProfileSettingsComponent } from './components/admin-dashboard/profile-settings/profile-settings.component';
import { ReviewsComponent } from './components/admin-dashboard/reviews/reviews.component';
import { OrderDetailsComponent } from './components/admin-dashboard/order-details/order-details.component';
import { ProfileComponent } from './components/user-dashboard/profile/profile.component';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard], children: [
        { path: '', redirectTo: 'buy-now', pathMatch: 'full' },
        { path: 'profile', component: ProfileComponent },
        { path: 'orders', component: OrdersComponent },
        { path: 'cart', component: CartComponent },
        { path: 'reviewed-products', component: ReviwedProductsComponent },
        { path: 'buy-now', component: BuyNowComponent },
        { path: 'product/:id', component: DetailComponent },
        // {path: 'products', component: DetailComponent}
    ] },
    {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        canActivate: [AdminGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: AnalyticsComponent },
          { path: 'products', component: ProductsComponent },
          { path: 'categories', component: CategoriesComponent },
          { path: 'order-details', component: OrderDetailsComponent},
          { path: 'users', component: UsersComponent },
          { path: 'profile-settings', component: ProfileSettingsComponent },
          { path: 'reviews', component: ReviewsComponent },
        ]
      },
    { path: '**', component: NotFoundComponent }
];