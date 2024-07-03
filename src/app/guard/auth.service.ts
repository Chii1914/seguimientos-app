import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionKey = 'authToken';
  private validationTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  async validateSession(): Promise<boolean> {
    const token = this.getSessionToken();
    if (!token) {
      return false;
    }

    try {
      const response = await firstValueFrom(this.http.get<{ isValid: boolean }>('/api/validate-session', {
        headers: { 'Authorization': `Bearer ${token}` }
      }));
      return response.isValid;
    } catch {
      return false;
    }
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
