import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';
  private cartItemCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  getCartItemCount(): Observable<number> {
    return this.cartItemCount.asObservable();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  addToCart(productId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { productId }, { headers: this.getAuthHeaders() }).pipe(
      tap(cart => {
        this.cartItemCount.next(cart.items.length);
      })
    );
  }

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      tap(cart => {
        this.cartItemCount.next(cart.items.length);
      })
    );
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl, { headers: this.getAuthHeaders(), body: { productId } }).pipe(
      tap(cart => {
        this.cartItemCount.next(cart.items.length);
      })
    );
  }
}