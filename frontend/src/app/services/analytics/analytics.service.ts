import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/users`, { headers: this.getAuthHeaders() });
  }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products`, { headers: this.getAuthHeaders() });
  }

  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders`, { headers: this.getAuthHeaders() });
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`, { headers: this.getAuthHeaders() });
  }
}