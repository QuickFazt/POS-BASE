import { Component, Input, OnInit } from '@angular/core';
import { Receipt } from 'src/app/models/receipt.model';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-added-products',
  templateUrl: './added-products.component.html',
  styleUrls: ['./added-products.component.scss'],
})
export class AddedProductsComponent implements OnInit {

  @Input() receipt: Receipt;

  constructor(private receiptService: ReceiptService) { }

  ngOnInit() {
  
  }

  increaseProduct(product){
    this.receiptService.addProduct(product);
  }

  decreaseProduct(product){
    this.receiptService.decreaseProduct(product);
  }

  removeProduct(product){
    this.receiptService.removeProduct(product);
  }


}
