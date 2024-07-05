import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../guard/auth.service';

import { Router } from '@angular/router';
import { CookieService } from '../cookies/cookie.service';

@Component({
  selector: 'app-loggin',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './loggin.component.html',
  styleUrl: './loggin.component.css'
})
export class LogginComponent {
  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) { }

  navigateToMain() {
    this.authService.verifySession().then(isValid => {
      if (isValid) {
        this.router.navigate(['/main']);
      }else{
        window.location.href = 'http://localhost:3000/api/auth/google';
      }
    });
  }


  async login(username: string, password: string) {
    // Assume the API returns a token on successful login 

    //AQUÍ SE MANEJARÁ LA LÓGICA DEL STREAM DE CARACTERES
    //const response = await firstValueFrom(this.authService.http.post<{ token: string }>('/api/login', { username, password }));
    //this.authService.setSessionToken(response.token);
    // Redirect to main or wherever needed
  }
  /*
    LÓGICA DEL LOGIN:
      - Se inicia sesión a través del backend, directamente con la api de google
      - Se obtiene el token de sesión
      - Se genera stream aleatorio de caracteres
      - Se envía a la app (aquí)
      - Se envía al backend con cada llamado al guard
  */


  //Luego cambiar el método login por el call a la api de login


  //logout() {
  //  this.authService.clearSessionToken();
  // Redirect to login page or handle logout
  //}
}
