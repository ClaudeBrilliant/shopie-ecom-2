import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  private apiUrl = 'http://localhost:3000/products';
  private categoriesUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createProduct(product: any): Observable<any> {
    console.log(product);
    return this.http.post<any>(this.apiUrl, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(productId: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${productId}`, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`, { headers: this.getAuthHeaders() });
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.categoriesUrl, { headers: this.getAuthHeaders() });
  }
}