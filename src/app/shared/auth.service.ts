import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  endpoint: string = 'http://18.191.255.47:5000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  public errorMessage: string = '';

  constructor(
    private http: HttpClient,
    public router: Router,
  ) { }

  // Sign-in
  signIn(user: User) {
    return this.http.post<any>(`${this.endpoint}/admin/authenticate`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token)
        this.router.navigate(['admin/dashboard'])
      })
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  public get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['admin']);
    }
  }

  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
