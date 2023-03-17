import { Component, inject, Signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from './product.type';

@Component({
  selector: 'app-product-details-dialog',
  template: `
    <div *effect>
      <h1 mat-dialog-title>{{ data.product().title }}</h1>
      <div mat-dialog-content>
        {{ data.product().description }}
      </div>
      <div mat-dialog-actions class="actions">
        <div class="space"></div>
        <p>{{ data.product().price | currency }}</p>
        <button mat-button color="primary">Add to card</button>
      </div>
    </div>
  `,
  styles: [
    `
      .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;

        .space {
          flex: 1;
        }

        p {
          margin: 0;
        }
      }
    `,
  ],
})
export class ProductDetailsDialogComponent {
  data: { product: Signal<Product> } = inject(MAT_DIALOG_DATA);
}
