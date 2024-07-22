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
  
  private studentId: string = "669ec5ff7fab6359be18d8bb";
  interviewForm: FormGroup;


  constructor(private fb: FormBuilder) {
    this.interviewForm = this.fb.group({
      date: ['', Validators.required],
      place: ['', Validators.required],
      campus: ['', Validators.required],
      grades: ['', Validators.required],
      attendance: ['', Validators.required],
      participation: ['', Validators.required],
      other: [''],
      justification: ['', Validators.required],
      comprehensionProblems: ['', Validators.required],
      lackOfPriorKnowledge: ['', Validators.required],
      healthReasons: [''],
      socialReasons: [''],
      otherReasons: [''],
      remedialActions: ['', Validators.required],
      notes: ['']
    });
  }
  onSubmit() {
    let date =  new Date(this.interviewForm.value.date);
    this.interviewForm = {... this.interviewForm.value, date: date.toISOString()};
    console.log(this.interviewForm);
    if (this.interviewForm.valid) {
      console.log(this.interviewForm.value);
      // Implement your submit logic here
    } else {
      alert('Please fill out all required fields.');
    }
  }
}

