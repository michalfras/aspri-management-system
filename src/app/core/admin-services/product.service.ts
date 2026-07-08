import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductData } from '@models/product-model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);

  getProductById(id: string) {
    return this.http.get<ProductData>(`${environment.apiUrl}/products/${id}`);
  }
}
