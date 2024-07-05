import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from '../cookies/cookie.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, MatButtonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router) { }

  //SACAR EL STRING DE CARACTERES DEL LOCALSTORAGE
  /*
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const validationString = params['string'];
      if (validationString) {
        localStorage.setItem('validationString', validationString);
      }
    });
  }
 */
  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      this.router.navigate([], {
        relativeTo: this.route,
        replaceUrl: true // This replaces the current state in history
      });

    });
  }
 
}
