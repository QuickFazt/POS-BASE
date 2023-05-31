import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ReceiptComponent } from 'src/app/components/common/receipt/receipt.component';
import { Steps } from 'src/app/models/generate-receipt-steps.model';
import { Receipt } from 'src/app/models/receipt.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NetworkService } from 'src/app/services/network.service';
import { OpeningsService } from 'src/app/services/openings.service';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-generate-receipt',
  templateUrl: './generate-receipt.page.html',
  styleUrls: ['./generate-receipt.page.scss'],
})
export class GenerateReceiptPage implements OnInit {

  receipt = {} as Receipt;
  steps = {} as Steps;
  currency = [];
  isConnected: BehaviorSubject<boolean>;
  salesCounter: number;
  constructor(
    private receiptService: ReceiptService,
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private toastController: ToastController,
    private openingService: OpeningsService,
    private networkService: NetworkService,
    private keyboard: Keyboard,
    private datePipe: DatePipe
  ) {
    this.isConnected = this.networkService.getNetworkStatus();
    this.networkService.getConnectNetwork();
    this.networkService.getDisconnectNetwork();
  }

  ngOnInit() {
    this.receipt = this.receiptService.getReceipt();
    this.receipt.taxPercent = 0;
    this.getTax();
    this.getCurrency();
  }

  ionViewWillEnter() {
    this.Step1();
  }

  getSubtotal() {
    this.receipt.subtotal = this.receiptService.getSubtotal();
    return this.receipt.subtotal;
  }

  getTotal() {
    this.receipt.total = (this.getSubtotal() * this.receipt.taxPercent / 100) + this.getSubtotal();
    return this.receipt.total;
  }

  getReceiptTax() {
    this.receipt.tax = this.getSubtotal() * this.receipt.taxPercent / 100;
    return this.receipt.tax;
  }

  getTax() {

    this.firebaseService.getCollection('tax').subscribe((data:any) => {
      
    let array = data.map(e => {
        return {
          id: e.payload.doc.id,
          taxPercent: e.payload.doc.data()['taxPercent'],       
        };
      });

      if(array && array[0].taxPercent){
        this.receipt.taxPercent = array[0].taxPercent;
      }else{
        this.receipt.taxPercent = 0;
      }

      
      console.log(this.receipt.tax);      
    });
    
  }

  getCurrency() {

    this.firebaseService.getCollection('currency')
      .subscribe(data => {

        this.currency = data.map(e => {
          return {
            id: e.payload.doc.id,
            symbol: e.payload.doc.data()['symbol'],
            name: e.payload.doc.data()['name'],
            price: e.payload.doc.data()['price']
          };
        });

        if (this.currency.length > 0) {
          this.receipt.currency = this.currency;
        }else{
          this.receipt.currency = []
        }

      }, error => {
        console.log(error)
      });
  }

  Step1() {
    this.steps.add_products = true;
    this.steps.add_products_checked = false;
    this.steps.user_data = false;
    this.steps.user_data_checked = false;
    this.steps.payment = false;
    this.steps.payment_checked = false;
    this.receipt.openingId = localStorage.getItem('openingId');
    this.receipt.cashierId = localStorage.getItem('uid');
    this.openingService.getCurentOpening(this.receipt.openingId);
  }

  Step2() {
    if (this.receipt.products.length > 0) {
      this.steps.add_products = true;
      this.steps.add_products_checked = true;
      this.steps.user_data = true;
      this.steps.user_data_checked = false;
      this.steps.payment = false;
      this.steps.payment_checked = false;
    } else {
      this.Toast('Agrega al menos un producto para avanzar')
    }

  }

  Step3() {
    this.steps.add_products = true;
    this.steps.add_products_checked = true;
    this.steps.user_data = true;
    this.steps.user_data_checked = true;
    this.steps.payment = true;
    this.steps.payment_checked = false;
  }

  Step4() {
    this.generateReceipt();
  }


  async generateReceipt() {
    this.receipt.date = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    this.receipt.hour = this.datePipe.transform(Date.now(), 'h:mm a');

    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.addToCollection('sales', this.receipt).then(res => {

      this.steps.add_products = true;
      this.steps.add_products_checked = true;
      this.steps.user_data = true;
      this.steps.user_data_checked = true;
      this.steps.payment = true;
      this.steps.payment_checked = true;
      this.updateCurrentOpening(this.receipt);

      loading.dismiss();


    }, error => {

      this.firebaseService.Toast('Ha ocurrido un error, intente de nuevo');
      loading.dismiss();

    })
  }

  async updateCurrentOpening(receipt) {

    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.openingService.updateCurrentOpening(receipt).then(res => {
      this.ReceiptGenerated(receipt);
      this.firebaseService.Toast('¡Venta generada exitosamente!');

      loading.dismiss();
      this.firebaseService.routerLink().navigateByUrl('/tabs/home');
    }, error => {
      console.log(error);

      loading.dismiss();
    })

  }

  async ReceiptGenerated(receipt) {
    const modal = await this.modalController.create({
      component: ReceiptComponent,
      componentProps: {
        receipt: receipt
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!data) {
      this.receiptService.removeAll();
    }

  }

  async Toast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      color: 'primary',
      position: 'middle'
    });
    toast.present();
  }
}
