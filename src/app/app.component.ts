import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/UI-elements/alert/alert.component';
import { AccessService } from './core/access.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  accessService = inject(AccessService);

  ngOnInit() {
    this.accessService.checkAccess();
  }
}
