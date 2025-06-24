import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, {
      observe: 'response' 
    }).pipe(
      tap(response => {
        console.log('Full HTTP response:', response);
        console.log('Response body:', response.body);
        
        if (response.body && response.body.access_token) {
          localStorage.setItem('access_token', response.body.access_token);
          
       
          localStorage.setItem('role', response.body.user.role);
     
          localStorage.setItem('user', JSON.stringify(response.body.user));
        }
      }),
     
      map(response => response.body)
    );
  }

  logout() {
    // Remove all stored authentication data
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    this.router.navigate(['/login']); 
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}