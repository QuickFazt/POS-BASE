import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NetworkService } from 'src/app/services/network.service';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  products = [];
  option = 'list';
  waiting: boolean;
  openings = [];
  isConnected: BehaviorSubject<boolean>;
  constructor(
    private firebaseService: FirebaseService,
    private receiptService: ReceiptService,
    private networkService: NetworkService
  ) {
    this.isConnected = this.networkService.getNetworkStatus();
    this.networkService.getConnectNetwork();
    this.networkService.getDisconnectNetwork();
  }

  ngOnInit() {
    this.getProducts();
  }

  ionViewWillEnter() {
    this.getOpenings();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      this.getOpenings();
      event.target.complete();
    }, 500)
  }

  getOpenings() {
    let assignedOpening = this.receiptService.getAssignedOpening();

    this.firebaseService.getCollectionConditional('pos_openings',
      ref => ref.where('closingDate', '==', 'En curso'))
      .subscribe(data => {

        this.openings = data.map(e => {
          return {
            id: e.payload.doc.id,
            cashierId: e.payload.doc.data()['cashierId']
          };
        });


        for (let o of this.openings) {
          if (o.cashierId == localStorage.getItem('uid')) {
            assignedOpening.next(true);
            localStorage.setItem('openingId', o.id);
          }
        }

        if (this.openings.length == 0) {
          assignedOpening.next(false);
        }

      }, error => {
        console.log(error)
      });
  }


  getProducts() {
    this.waiting = true;

    this.firebaseService.getCollectionConditional('products',
      ref => ref.where('stock', '>', 0))
      .subscribe(data => {

        this.waiting = false;

        this.products = data.map(e => {
          return {
            id: e.payload.doc.id,
            image: e.payload.doc.data()['image'],
            name: e.payload.doc.data()['name'],
            price: e.payload.doc.data()['price'],
            stock: e.payload.doc.data()['stock'],
          };
        });


      }, error => {
        console.log(error)
      });
  }

}
