import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.type';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  http = inject(HttpClient);

  getProduct(productId: number) {
    return this.http.get<Product>(
      `https://fakestoreapi.com/products/${productId}`
    );
  }

  getProductsByCategory(category: string) {
    if (category === 'All') {
      return this.http.get<Product[]>('https://fakestoreapi.com/products');
    }

    return this.http.get<Product[]>(
      `https://fakestoreapi.com/products/category/${category}`
    );
  }

  getCategories() {
    return this.http
      .get<string[]>('https://fakestoreapi.com/products/categories')
      .pipe(map((categories) => ['All', ...categories]));
  }
}
