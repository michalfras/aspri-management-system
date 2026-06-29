import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  imports: [],
  templateUrl: './validation-message.component.html',
  styleUrl: './validation-message.component.css',
})
export class ValidationMessageComponent {
  @Input({ required: true }) selectedFormControl!: FormControl;
}
