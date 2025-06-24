import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllOrders(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  confirmOrder(orderId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirm`, { orderId }, { headers: this.getAuthHeaders() });
  }
}