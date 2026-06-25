import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { ProductData } from '../../../models/product-model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-badge',
  imports: [TranslateModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
})
export class BadgeComponent {
  @Input() badgeName?: ProductData['badge'];
  badgeText = '';

  setText() {
    if (this.badgeName === 'favourite') {
      this.badgeText = 'GENERAL.BADGE.FAV';
    }
    if (this.badgeName === 'hot') {
      this.badgeText = 'GENERAL.BADGE.HOT';
    }
    if (this.badgeName === 'kids') {
      this.badgeText = 'GENERAL.BADGE.KIDS';
    }
    if (this.badgeName === 'vegetarian') {
      this.badgeText = 'GENERAL.BADGE.VEGETARIAN';
    }
    if (this.badgeName === 'beer') {
      this.badgeText = 'GENERAL.BADGE.BEER';
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['badgeName']) {
      this.setText();
    }
  }
}
