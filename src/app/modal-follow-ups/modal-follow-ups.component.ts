import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from '../cookies/cookie.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-modal-follow-ups',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-follow-ups.component.html',
  styleUrl: './modal-follow-ups.component.css'
})
export class ModalFollowUpsComponent implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() student: any;

  followups: any;

  @Output() closeModalEvent = new EventEmitter<void>();
  constructor(private cookieService: CookieService, private http: HttpClient) { }

  async fetchFollowUps(): Promise<void> {
    const headers = { Authorization: `Bearer ${this.cookieService.getCookie('xvlf')}` };
    try {
      console.log(this.student._id);
      const response = await firstValueFrom(this.http.get(`http://localhost:3000/api/student/${this.student._id}/follow-ups`, { headers }));
      this.followups = response;
      console.log(this.followups);
    } catch (e) {
      console.log(e);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showModal'] && this.showModal) {
      this.fetchFollowUps();
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
  addFollowUp() {
    // Logic to open a form/modal to add a new follow-up
    console.log('Add Follow-up');
  }

  editFollowUp(followUpId: string) {
    // Logic to edit the selected follow-up
    console.log('Edit Follow-up', followUpId);
  }

  deleteFollowUp(followUpId: string) {
    /*
    const headers = { Authorization: `Bearer ${this.cookieService.getCookie('xvlf')}` };
    this.http.delete(`http://localhost:3000/api/student/${this.student.rut}/follow-ups/${followUpId}`, { headers }).subscribe(() => {
      // Remove the deleted follow-up from the list
      this.followups = this.followups.filter((followup: any) => followup._id !== followUpId);
    }, (error) => {
      console.error('Error deleting follow-up:', error);
    });
    */
  }
  
}