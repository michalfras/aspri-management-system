import { Component, inject } from '@angular/core';
import { AlertService } from '../../../core/alert.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-alert',
  imports: [TranslateModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  alertService = inject(AlertService);
}
