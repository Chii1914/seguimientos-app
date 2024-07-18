import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-or-mod-follow-up',
  standalone: true,
  imports: [],
  templateUrl: './add-or-mod-follow-up.component.html',
  styleUrl: './add-or-mod-follow-up.component.css'
})
export class AddOrModFollowUpComponent {
 @Input() followUp: any;
 @Input() student: any; 

}
