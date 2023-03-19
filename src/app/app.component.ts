import { Component, signal } from '@angular/core';
import { Product } from './product.type';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsDialogComponent } from './product-details-dialog.component';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <app-category-list
      *effect
      class="categories"
      [categories]="categories()"
      [selectedCategory]="selectedCategory()"
      (categorySelected)="selectCategory($event)"
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
            (click)="openProductDetailsDialog(product)"
          >
            View Product
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
})
export class AppComponent {
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('All');

  constructor(private matDialog: MatDialog, private shopService: ShopService) {
    this.getCategories();
    this.getProductsByCategory('All');
  }

  async getCategories() {
    const categories$ = this.shopService.getCategories();
    const categories = await firstValueFrom(categories$);
    this.categories.set(categories);
  }

  async getProductsByCategory(category: string) {
    const productsByCategory$ =
      this.shopService.getProductsByCategory(category);
    const products = await firstValueFrom(productsByCategory$);
    this.products.set(products);
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
    this.getProductsByCategory(this.selectedCategory());
  }

  async openProductDetailsDialog(p: Product) {
    const product$ = this.shopService.getProduct(p.id);
    const product = await firstValueFrom(product$);

    this.matDialog.open(ProductDetailsDialogComponent, {
      data: { product: signal<Product>(product) },
      width: '500px',
      height: '300px',
    });
  }
}
