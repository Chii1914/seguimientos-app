import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validator, FormBuilder } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CookieService } from '../cookies/cookie.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-student',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {
  studentForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private cookieService: CookieService, private router: Router) {
    this.studentForm = this.fb.group({
      name: [''],
      rut: [''],
      email: [''],
      sede: [''],
      semester: [''],
      phone: [''],
      location: [''],
      academicCharacter: [''],
      healthReason: [''],
      socialReason: [''],
      remedialAction: ['']
    });
  }

  async onSubmit(event: Event, action: string) {
    switch (action) {
      case 'saveAndFollowUp':
        // Logic for saving and adding follow-up
        break;
      case 'saveAndExit':
        await this.save();
        this.router.navigate(['/main']);
        break;
      case 'back':
        // Logic for going back
        break;
      default:
        break;
    }
  }

  async save() {
    try {
      const formData = this.studentForm.value;
      console.log(formData)
      const response = await firstValueFrom(this.http.post('http://localhost:3000/api/student', formData, {
        headers: {
          Authorization: `Bearer ${this.cookieService.getCookie('xvlf')}`
        }
      }));
      alert('Estudiante creado satisfactoriamente')
    } catch (error) {
      console.log(error)
      alert('Error al crear estudiante')}
  }
} 


