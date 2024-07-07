import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CookieService } from '../cookies/cookie.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { HeaderComponent } from '../header/header.component';
import { ModalFollowUpsComponent } from '../modal-follow-ups/modal-follow-ups.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ModalFollowUpsComponent],
  templateUrl: './student-table.component.html',
  styleUrl: './student-table.component.css'
})
export class StudentTableComponent {

  showModal: boolean = false;
  selectedStudent: any;
  students: any;
  exportDropdownVisible: boolean = false;

  constructor(private router: Router,private http: HttpClient, private cookieService: CookieService) { }

  async ngOnInit(): Promise<void> {
    const headers = { Authorization: `Bearer ${this.cookieService.getCookie('xvlf')}` };
    try {
      const response = await firstValueFrom(this.http.get('http://localhost:3000/api/student', { headers }));
      this.students = response;
      console.log(this.students[0].name)
    } catch (e) {
      console.log(e);
    }
  }
  goBack() {
    this.router.navigate(['/main']);
  }

  openModal(student: any) {
    this.selectedStudent = student;
    this.showModal = true;
  }
  handleCloseModal() {
    this.showModal = false;
  }
  toggleExportDropdown(student: any) {
    this.selectedStudent = student;
    this.exportDropdownVisible = !this.exportDropdownVisible;
  }

  exportToExcel(student: any) {
    this.exportDropdownVisible =  !this.exportDropdownVisible;
    // Implement your logic to export the student's data to Excel
    console.log('Export to Excel', student);
  }

  generateWordFile(student: any) {
    this.exportDropdownVisible =  !this.exportDropdownVisible;
    // Implement your logic to generate a Word file with the student's data
    console.log('Generate Word File', student);
  }

}