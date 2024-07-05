import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CookieService } from '../cookies/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionKey = 'authToken';
  private validationStringKey = 'validationString';

  constructor(private http: HttpClient,  private cookieService: CookieService) { }

  async verifySession(): Promise<boolean> {
    const xvlf = this.cookieService.getCookie('xvlf');
    if (!xvlf) {
      return false;
    }
    // Assuming you send the cookie value to the server to verify the session
    try {
      const response = await firstValueFrom(this.http.get('http://localhost:3000/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${xvlf}`
        }
      }));
      if (response) {
        return true;
      }
    } catch (error: any) {
      if (error.status === 403) {
        console.log('Forbidden');
        return false;
      }
    }
    return false;
  }

  setSessionToken(token: string): void {
    localStorage.setItem(this.sessionKey, token);
  }

  getSessionToken(): string | null {
    return localStorage.getItem(this.sessionKey);
  }

  getValidationString(): string | null {
    return localStorage.getItem(this.validationStringKey);
  }

  clearSessionToken(): void {
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.validationStringKey);
  }

}
