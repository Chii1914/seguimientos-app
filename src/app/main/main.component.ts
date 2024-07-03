import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  constructor(private route: ActivatedRoute) {}
  //SACAR EL STRING DE CARACTERES DEL LOCALSTORAGE
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const validationString = params['string'];
      if (validationString) {
        localStorage.setItem('validationString', validationString);
      }
    });
  }
}
