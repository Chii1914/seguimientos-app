import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CookieService } from '../cookies/cookie.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router, private cookieService: CookieService) { }

  @Input() headerIsLoggedIn=true;

  logout() {
    this.cookieService.deleteCookie('xvlf');
    this.router.navigate(['/']);
  }

}
