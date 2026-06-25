import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-alergens',
  imports: [TranslateModule],
  templateUrl: './alergens.component.html',
  styleUrl: './alergens.component.css',
})
export class AlergensComponent {
  @ViewChild('alergens') alergens!: ElementRef;
  @Input() inHome = false;
  showAlergens = false;

  toggleAlergens() {
    this.showAlergens = !this.showAlergens;

    if (this.showAlergens) {
      setTimeout(() => {
        this.alergens.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }
}
