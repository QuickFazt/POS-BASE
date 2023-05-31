import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ReceiptComponent } from 'src/app/components/common/receipt/receipt.component';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {

  openingId: string;
  sales = [];
  waiting: boolean;

  constructor(
    private firebaseService: FirebaseService,
    private modalController: ModalController,   
    private actRoute: ActivatedRoute) { 

      this.openingId = this.actRoute.snapshot.paramMap.get('id');
    }

  ngOnInit() {
    this.getSales();
  }

  getSales() {

    this.waiting = true;

    this.firebaseService.getCollectionConditional('sales',
     ref => ref.where('openingId','==',this.openingId)).subscribe(data => {

        this.waiting = false;

        this.sales = data.map(e => {
          return {
            id: e.payload.doc.id,
            date: e.payload.doc.data()['date'],
            hour: e.payload.doc.data()['hour'],
            change: e.payload.doc.data()['change'],
            clientId: e.payload.doc.data()['clientId'],
            cashierId: e.payload.doc.data()['cashierId'],           
            products: e.payload.doc.data()['products'],
            img: e.payload.doc.data()['img'],
            amountReceived: e.payload.doc.data()['amountReceived'],
            subtotal: e.payload.doc.data()['subtotal'],            
            total: e.payload.doc.data()['total'],
            tax: e.payload.doc.data()['tax'],
            taxPercent: e.payload.doc.data()['taxPercent'],
            currency: e.payload.doc.data()['currency']
          };
        });
        
      });
  }

  async Receipt(receipt) {
    const modal = await this.modalController.create({
      component: ReceiptComponent,
      componentProps: { receipt: receipt }
    });

    await modal.present();

  }
}
