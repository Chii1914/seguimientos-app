import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../guard/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-loggin',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './loggin.component.html',
  styleUrl: './loggin.component.css'
})
export class LogginComponent {
  constructor(private authService: AuthService) {}

  async login(username: string, password: string) {
    // Assume the API returns a token on successful login 

    //AQUÍ SE MANEJARÁ LA LÓGICA DEL STREAM DE CARACTERES
    //const response = await firstValueFrom(this.authService.http.post<{ token: string }>('/api/login', { username, password }));
    //this.authService.setSessionToken(response.token);
    // Redirect to main or wherever needed
  }

  //logout() {
  //  this.authService.clearSessionToken();
    // Redirect to login page or handle logout
  //}
}
