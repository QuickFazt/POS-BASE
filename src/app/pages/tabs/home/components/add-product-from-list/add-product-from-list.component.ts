import { Component, Input, OnInit } from '@angular/core';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-add-product-from-list',
  templateUrl: './add-product-from-list.component.html',
  styleUrls: ['./add-product-from-list.component.scss'],
})
export class AddProductFromListComponent implements OnInit {

  @Input() products;
  @Input() waiting;
  result = '';
  constructor(private receiptService: ReceiptService) { }

  ngOnInit() {

  }

  addProduct(product) {
    this.receiptService.addProduct(product);
  }

  searchProduct(event) {
    const texto: string = event.target.value;
    this.result = texto;
  }
}
