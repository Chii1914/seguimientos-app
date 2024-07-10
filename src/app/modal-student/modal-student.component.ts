import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-modal-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-student.component.html',
  styleUrl: './modal-student.component.css'
})
export class ModalStudentComponent {
  @Input() showModalStudent: boolean = false;
  @Input() student: any;

  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal() {
    this.closeModalEvent.emit();
  }

  deleteStudent() { }
  updateStudent() { }
}
