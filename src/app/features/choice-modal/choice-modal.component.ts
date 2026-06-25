import {
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  ViewChild,
  effect,
} from '@angular/core';
import { CartService } from '../../core/cart.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../core/alert.service';
import { UiService } from '../../core/ui.service';
import { BadgeComponent } from '../../shared/UI-elements/badge/badge.component';
import { MenuService } from '../../core/menu.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-choice-modal',
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, BadgeComponent],
  templateUrl: './choice-modal.component.html',
  styleUrl: './choice-modal.component.css',
})
export class ChoiceModalComponent {
  cartService = inject(CartService);
  alertService = inject(AlertService);
  UiService = inject(UiService);
  menuService = inject(MenuService);
  themeService = inject(ThemeService);

  product = this.UiService.selectedProductData;

  isNextProduct = computed(() => {
    const position = this.checkProductPosition();
    if (!position) return;
    return position.index < position.allCategoryProducts.length - 1;
  });
  isPreviousProduct = computed(() => {
    const position = this.checkProductPosition();
    if (!position) return;
    return position.index > 0;
  });

  animateNextPage = false;
  animatePreviousPage = false;

  @Input() isInMenuComponent = false;
  @ViewChild('scrolledContent') scrollDown!: ElementRef;
  oneChoice = new FormControl(null);

  addToCart() {
    const product = this.product();

    if (!product) return;
    if (!this.oneChoice.value && product.choices) {
      this.scrollDown.nativeElement.scrollTo({
        top: this.scrollDown.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
      return;
    }
    this.oneChoice.value
      ? this.cartService.addToCart(product, this.oneChoice.value)
      : this.cartService.addToCart(product);
    this.oneChoice.setValue(null);
  }
  closeModal() {
    document.body.classList.remove('no-scroll');
    window.scrollTo(0, this.UiService.scrollY);
    document.body.style.top = '';

    this.UiService.isChoiceModalOpen.set(false);
    this.oneChoice.setValue(null);
  }
  onClick(whichOne: 'next' | 'previous') {
    if (whichOne === 'next') {
      this.animateNextPage = true;
      setTimeout(() => (this.animateNextPage = false), 180);
      return;
    }
    if (whichOne === 'previous') {
      this.animatePreviousPage = true;
      setTimeout(() => (this.animatePreviousPage = false), 180);
      return;
    }
    return;
  }
  private checkProductPosition() {
    const allMenuProducts = Object.values(
      this.menuService.groupedMenuProducts()
    )
      .flatMap((category) => Object.values(category))
      .flat();

    const allCategoryProducts = allMenuProducts.filter(
      (item) => item.category === this.product()?.category
    );
    const index = allCategoryProducts.findIndex(
      (item) => item.id === this.product()?.id
    );
    return { index, allCategoryProducts };
  }

  nextProduct() {
    const position = this.checkProductPosition();
    if (!this.isNextProduct()) return;
    this.onClick('next');
    this.UiService.selectedProductData.set(
      position.allCategoryProducts[position.index + 1]
    );
  }

  previousProduct() {
    const position = this.checkProductPosition();
    if (!this.isPreviousProduct()) return;
    this.onClick('previous');
    this.UiService.selectedProductData.set(
      position.allCategoryProducts[position.index - 1]
    );
  }
  private preloadImages = effect(() => {
    const position = this.checkProductPosition();
    const nextImage = position.allCategoryProducts[position.index + 1]?.image;
    const previousImage =
      position.allCategoryProducts[position.index - 1]?.image;
    if (nextImage) {
      const img = new Image();
      img.src = nextImage;
    }
    if (previousImage) {
      const img = new Image();
      img.src = previousImage;
    }
  });
}
