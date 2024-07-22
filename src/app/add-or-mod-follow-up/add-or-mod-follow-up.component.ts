import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators ,ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-add-or-mod-follow-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-or-mod-follow-up.component.html',
  styleUrl: './add-or-mod-follow-up.component.css'
})
export class AddOrModFollowUpComponent {
  @Input() followUp: any;
  @Input() student: any;
  interviewForm: FormGroup;


  constructor(private fb: FormBuilder) {
    this.interviewForm = this.fb.group({
      title: ['Entrevista personal a estudiante', Validators.required],
      dateTime: ['', Validators.required],
      place: ['', Validators.required],
      campus: ['', Validators.required],
      generalDetails: this.fb.group({
        grades: ['', Validators.required],
        attendance: ['', Validators.required],
        participation: ['', Validators.required],
        other: ['']
      }),
      academicIssues: this.fb.group({
        comprehensionProblems: ['', Validators.required],
        lackOfPriorKnowledge: ['', Validators.required]
      }),
      healthReasons: [''],
      socialReasons: [''],
      otherReasons: [''],
      remedialActions: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.interviewForm.valid) {
      console.log(this.interviewForm.value);
      // Implement your submit logic here
    } else {
      alert('Please fill out all required fields.');
    }
  }
}

