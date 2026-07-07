import { Component, Input } from '@angular/core';
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
import {
  BADGE_OPTIONS,
  ProductFormData,
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

  subcategoryAdmin = SUBCATEGORY_ADMIN_OPTIONS;
  badgeOptions = BADGE_OPTIONS;
  value = 'Clear me';

  form = new FormGroup({
    name: new FormControl<string>(''),
    info: new FormControl<string>(''),
    shortInfo: new FormControl<string>(''),
    price: new FormControl<number>(0),
    category: new FormControl<string>(''),
    subcategory: new FormControl<string>(''),
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
    selectedBadge: new FormControl<string>(''),
    isPopular: new FormControl<boolean>(false),
    forcePopup: new FormControl<boolean>(false),
    showInfoInMenu: new FormControl<boolean>(false),
  });

  ngOnInit() {
    console.log(this.product);
    // OBSLUZYC UZUPELNIANIE FORMULARZA DANYMI Z PRODUCT
  }

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
