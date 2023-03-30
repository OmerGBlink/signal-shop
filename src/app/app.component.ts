import { Component, signal } from '@angular/core';
import { Product } from './product.type';
import {
  exhaustMap,
  firstValueFrom,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from './product-details-dialog.component';
import { ShopService } from './shop.service';
import { fromObservable, registerRxEffect } from './rx-interop';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <app-category-list
      *effect
      class="categories"
      [categories]="categories()"
      [selectedCategory]="selectedCategory()"
      (categorySelected)="selectedCategorySubject.next($event)"
    ></app-category-list>

    <div *effect class="grid">
      <mat-card *ngFor="let product of products()" class="example-card">
        <mat-card-header>
          <mat-card-title>{{ product.title }}</mat-card-title>
        </mat-card-header>
        <img mat-card-image [src]="product.image" />
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="productDetailsSubject.next(product)"
          >
            View Product
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
})
export class AppComponent {
  selectedCategorySubject = new Subject<string>();
  productDetailsSubject = new Subject<Product>();
  product$ = this.productDetailsSubject.pipe(
    exhaustMap((product) => {
      return this.shopService.getProduct(product.id);
    })
  );
  selectedCategory$ = this.selectedCategorySubject.pipe(startWith('All'));

  products$ = this.selectedCategory$.pipe(
    switchMap((category) => {
      return this.shopService.getProductsByCategory(category);
    })
  );
  products = fromObservable(this.products$);
  categories = signal<string[]>([]);
  selectedCategory = fromObservable(this.selectedCategory$);

  constructor(private matDialog: MatDialog, private shopService: ShopService) {
    this.getCategories();

    registerRxEffect(this.product$, (product) => {
      this.matDialog.open(ProductDetailsDialogComponent, {
        data: { product: signal<Product>(product) },
        width: '500px',
        height: '300px',
      });
    });
  }

  async getCategories() {
    const categories$ = this.shopService.getCategories();
    const categories = await firstValueFrom(categories$);
    this.categories.set(categories);
  }
}
