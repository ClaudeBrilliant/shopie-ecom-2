import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createOrder(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {}, { headers: this.getAuthHeaders() });
  }

  getOrders(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl, { headers: this.getAuthHeaders(), body: { orderId } });
  }
}