import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public http: HttpClient) {}

  private sessionKey = 'authToken';
  async validateSession(): Promise<boolean> {
    return true; // Remove this line and uncomment the following lines to enable session validation
    /*
    try {
      const response = await firstValueFrom(this.http.get<{ isValid: boolean }>('/api/validate-session'));
      return response.isValid;
    } catch {
      return false;
    }
      */
  }

  setSessionToken(token: string): void {
    localStorage.setItem(this.sessionKey, token);
  }

  getSessionToken(): string | null {
    return localStorage.getItem(this.sessionKey);
  }

  clearSessionToken(): void {
    localStorage.removeItem(this.sessionKey);
  }
}
