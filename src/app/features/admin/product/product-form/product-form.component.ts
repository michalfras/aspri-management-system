import { Component, inject, Input } from '@angular/core';
import {
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { LanguageService } from '@core/shared-services/language.service';
import {
  BADGE_OPTIONS,
  BadgeOptions,
  Category,
  ProductFormData,
  Subcategories,
  SUBCATEGORY_ADMIN_OPTIONS,
} from '@models/product-model';
@Component({
  selector: 'app-product-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatOption,
    MatSelect,
    MatRadioModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {
  @Input({ required: true }) product!: ProductFormData;
  @Input({ required: true }) mode!: 'editMode' | 'addMode';

  languageService = inject(LanguageService);

  subcategoryAdmin = SUBCATEGORY_ADMIN_OPTIONS;
  badgeOptions = BADGE_OPTIONS;

  form = new FormGroup({
    name: new FormControl<string>(''),
    info: new FormControl<string>(''),
    shortInfo: new FormControl<string>(''),
    price: new FormControl<number>(0),
    category: new FormControl<Category | ''>(''),
    subcategory: new FormControl<Subcategories | ''>(''),
    hasOptions: new FormControl<boolean>(false),
    optionsContainer: new FormArray<FormGroup>([
      new FormGroup({
        optionText: new FormControl(''),
        price: new FormControl<number>(0),
      }),
      new FormGroup({
        optionText: new FormControl(''),
        price: new FormControl<number>(0),
      }),
    ]),
    hasBadge: new FormControl<boolean>(false),
    selectedBadge: new FormControl<BadgeOptions | ''>(''),
    isPopular: new FormControl<boolean>(false),
    forcePopup: new FormControl<boolean>(false),
    showInfoInMenu: new FormControl<boolean>(false),
  });

  ngOnInit() {
    console.log(this.product);
    this.form.patchValue({
      name: this.getTranslatedFormName(),
      info: this.getTranslatedFormInfo(),
      shortInfo: this.getTranslatedFormShortInfo(),
      price: this.product.price,
      category: this.product.category,
      subcategory: this.product.subcategory,
      hasOptions: this.product.choices?.length ? true : false,

      hasBadge: !!this.product.badge,
      selectedBadge: this.product.badge ?? '',
      isPopular: !!this.product.isPopular,
      forcePopup: !!this.product.forcePopup,
      showInfoInMenu: !!this.product.showInfoInMenu,
    });

    this.form.controls.optionsContainer.clear();
    if (!this.product.choices) return;
    this.product.choices.forEach((choice) => {
      const translatedChoice =
        this.languageService.getTranslatedChoice(choice) ?? '';

      this.form.controls.optionsContainer.push(
        new FormGroup({
          optionText: new FormControl(translatedChoice),
          price: new FormControl(choice.price),
        })
      );
    });
  }

  private getTranslatedFormName() {
    if (this.product.adminName?.pl) return this.product.adminName.pl;
    if (this.product.nameKey === 'ADMIN_DATA') return '';
    return this.languageService.getTranslatedName(this.product);
  }
  private getTranslatedFormInfo() {
    if (this.product.adminInfo?.pl) return this.product.adminInfo.pl;
    if (this.product.infoKey === 'ADMIN_DATA') return '';
    return this.languageService.getTranslatedInfo(this.product);
  }

  private getTranslatedFormShortInfo() {
    if (this.product.adminShortInfo?.pl) return this.product.adminShortInfo.pl;
    if (this.product.shortInfoKey === 'ADMIN_DATA') return '';
    return this.languageService.getTranslatedShortInfo(this.product);
  }

  // private getTranslatedFormChoice() {
  //   this.product.choices?.forEach((choice) => {
  //     const choiceAdminLabel = choice.adminLabel;
  //     const choiceLabelKey = choice.labelKey;
  //     if (choiceAdminLabel?.pl) return choiceAdminLabel.pl;
  //     if (choiceLabelKey === 'ADMIN_DATA') return '';
  //     return this.languageService.getTranslatedChoice(choice);
  //   });
  // }

  addChoiceInput() {
    const choice = new FormGroup({
      optionText: new FormControl(''),
      price: new FormControl<number>(0),
    });
    this.choicesArr.push(choice);
  }
  deleteChoiceInput(index: number) {
    this.choicesArr.removeAt(index);
  }

  get choicesArr() {
    return this.form.controls.optionsContainer;
  }
}
