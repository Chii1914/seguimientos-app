import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators ,ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-or-mod-follow-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-or-mod-follow-up.component.html',
  styleUrl: './add-or-mod-follow-up.component.css'
})
export class AddOrModFollowUpComponent implements OnInit{
  studentId: any;
  followUp: any;
  
  //private studentId: string = "669ec5ff7fab6359be18d8bb";
  interviewForm: FormGroup;


  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      const state = navigation.extras.state as { studentId?: any };  
      this.studentId = state?.studentId ?? null;
      console.log('Received studentId in follow component:', this.studentId);
    } else {
      console.error('Navigation state is not available.');
    }
  }
  
  

  constructor(private fb: FormBuilder, private router: Router) {
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
  
  debug(){
    console.log(this.studentId);
  }

  onSubmit() {
    let date =  new Date(this.interviewForm.value.date);
    this.interviewForm = {... this.interviewForm.value, date: date.toISOString()};
    console.log(this.interviewForm);
    if (this.interviewForm.valid) {
      console.log(this.interviewForm.value);
    } else {
      alert('Porfavor rellene todos los campos.');
    }
  }
  exit(){
    this.router.navigate(['/main']);
  }
}

