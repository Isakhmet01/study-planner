import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://127.0.0.1:8000/api/login/';
  private logoutUrl = 'http://127.0.0.1:8000/api/logout/';

  constructor(private http: HttpClient) {}


  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password });
  }

  logout(): Observable<any> {
    return this.http.post(this.logoutUrl, {});
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  signup(username: string, password: string) {
    return this.http.post('http://127.0.0.1:8000/api/signup/', { username, password });
  }
}
