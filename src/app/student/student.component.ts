import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CookieService } from '../cookies/cookie.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-student',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, CommonModule, FormsModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {
  studentForm: FormGroup;
  showDropdown = false;
  certificates: { name: string, file: File | null }[] = [];
  fileNames: string[] = [];
  selectedFiles: File[] = [];
  studentId: string = "";



  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private cookieService: CookieService, private router: Router) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      rut: ['', [Validators.required, Validators.pattern('[0-9]{7,8}-[0-9kK]')]],
      email: ['', [Validators.required, Validators.email]],
      semester: ['', Validators.required],
      sede: ['', Validators.required],
      phone: ['', [Validators.pattern('[0-9]{9}')]],
      location: [''],
      academicCharacter: [''],
      healthReason: [''],
      socialReason: [''],
      remedialAction: ['']
    });
  }

  addCertificate() {
    this.certificates.push({ name: '', file: null });
  }

  removeCertificate(index: number) {
    this.certificates.splice(index, 1);
  }

  onFileChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.certificates[index].file = input.files[0];
    }
  }

  async onSubmit(event: Event, action: string) {
    switch (action) {
      case 'saveAndFollowUp':
        await this.save();
        await this.saveFiles(this.studentId);
        this.router.navigate(['/follow'], { state: { studentId: this.studentId } });
        break;
      case 'saveAndExit':
        await this.save();
        await this.saveFiles(this.studentId);
        this.router.navigate(['/main']);
        break;
      case 'back':
        this.router.navigate(['/main']);
        break;
      case 'deb':
        this.router.navigate(['/follow'], { state: { studentId: "YOEL STRING" } });
        break;
      default:
        break;
    }
  }

  async save() {
    try {
      const formData = this.studentForm.value;
      console.log(formData)
      const response = await firstValueFrom(this.http.post<any>('http://localhost:3000/api/student', formData, {
        headers: {
          Authorization: `Bearer ${this.cookieService.getCookie('xvlf')}`
        }
      }));
      this.studentId = response._id;
      alert('Estudiante creado satisfactoriamente')
    } catch (error) {
      console.log(error)
      alert('Error al crear estudiante')
    }
  }

  async saveFiles(studentId: string) {
    try {
      const formData = new FormData();
      this.selectedFiles.forEach(file => {
        formData.append('files', file, file.name);
      });
  
      const response = await firstValueFrom(this.http.post(`http://localhost:3000/api/student/files/${studentId}`, formData, {
        headers: {
          Authorization: `Bearer ${this.cookieService.getCookie('xvlf')}`
        }
      }));
      alert('Archivos del estudiante subidos satisfactoriamente');
    } catch (error) {
      console.log(error);
      alert('Error al subir los archivos del estudiante');
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      if (file) {
        this.fileNames.push(file.name);
        this.selectedFiles.push(file);
      }
    }
  }

  setNA(event: Event, formControlName: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.studentForm.get(formControlName)?.setValue('n/a');
    } else {
      this.studentForm.get(formControlName)?.setValue('');
    }
  }

}


