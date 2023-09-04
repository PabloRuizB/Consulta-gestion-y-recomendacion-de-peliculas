import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationsService {
  private localStorageKey = 'my-app-token';

  constructor() {}

  setToken(token: string) {
    localStorage.setItem(this.localStorageKey, token);
  }

  getToken() {
    console.log(localStorage.getItem(this.localStorageKey))
    return localStorage.getItem(this.localStorageKey);
  }

  removeToken() {
    localStorage.removeItem(this.localStorageKey);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    const decodedToken: any = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  }
}
