import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-panel',
  imports: [ReactiveFormsModule],
  templateUrl: './login-panel.component.html',
  styleUrl: './login-panel.component.css',
})
export class LoginPanelComponent {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
}
