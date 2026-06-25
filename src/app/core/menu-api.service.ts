import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductData } from '../models/product-model';

@Injectable({
  providedIn: 'root',
})
export class MenuApiService {
  private readonly http = inject(HttpClient);
  private readonly apirUrl = `${environment.apiUrl}/products`;

  getProducts() {
    return this.http.get<ProductData[]>(this.apirUrl);
  }
}
