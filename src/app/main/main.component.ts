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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      this.router.navigate([], {
        relativeTo: this.route,
        replaceUrl: true
      });

    });
  }

  debug() {
    const cookieValue = this.cookieService.getCookie('xvlf');
    console.log(cookieValue);
    navigator.clipboard.writeText(cookieValue || "").then(() => {
      console.log('Cookie value copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy cookie value: ', err);
    });
  }  
  navSeg() {
    this.router.navigate(['/studentAll']);
  }
  navStudent(){
    this.router.navigate(['/student']);
  }
  
}
