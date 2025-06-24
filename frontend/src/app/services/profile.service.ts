import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/profile';
  private userApiUrl = 'http://localhost:3000/users'; // Add this line

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  updateUserProfile(email: string, name: string): Observable<any> {
    return this.http.put<any>(this.apiUrl, { email, name }, { headers: this.getAuthHeaders() });
  }

  updateUserPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.userApiUrl}/reset-password`, { email, newPassword }); // Change this line
  }
}