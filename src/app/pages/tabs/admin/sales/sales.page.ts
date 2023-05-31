import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ReceiptComponent } from 'src/app/components/common/receipt/receipt.component';
import { UserDetailComponent } from 'src/app/components/common/user-detail/user-detail.component';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {

  currentDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
  cashier: string = 'all';
  sales = [];
  users = [];
  waiting: boolean;
  user = {} as User;
  constructor(
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getSales();
    this.getUsers();
  }

  async Options(receipt) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Recibo',
        icon: 'receipt-outline',
        handler: () => {
          this.Receipt(receipt);
        }
      }, {
        text: 'Cajero Encargado',
        icon: 'person-outline',
        handler: () => {
          this.getUserData(receipt.cashierId);
        }
      }]
    });

    await actionSheet.present();
  }

  async getUserData(id) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.getDataById('users', id).valueChanges()
      .subscribe(data => {
        loading.dismiss();
        this.user.id = id;
        this.user.name = data['name'];
        this.user.lastname = data['lastname'];
        this.user.email = data['email'];
        this.user.dni = data['dni'];
        this.user.img = data['img'];

        this.getCashier();
      }, error => {
        loading.dismiss();
      });
  }

  async getCashier() {
    const modal = await this.modalController.create({
      component: UserDetailComponent,
      cssClass: 'profile-modal',
      componentProps: { user: this.user }
    });

    await modal.present();

  }

  async Receipt(receipt) {
    const modal = await this.modalController.create({
      component: ReceiptComponent,
      componentProps: { receipt: receipt }
    });

    await modal.present();

  }


  getSalesType(event){
   let selectedOption = event.target.value;

   if(selectedOption == 'all'){
      this.getSales();
   }else{
      this.getSalesWithCashier(selectedOption);
   }

  }

  getUsers() {
    this.waiting = true;

    this.firebaseService.getCollection('users')
      .subscribe(data => {

        this.waiting = false;

        this.users = data.map(e => {
          return {
            id: e.payload.doc.id,
            img: e.payload.doc.data()['img'],          
            name: e.payload.doc.data()['name'],
            lastname: e.payload.doc.data()['lastname']           
          };
        });

      }, error => {
        console.log(error)
      });
  }

  getSales() {

    this.waiting = true;

    this.firebaseService.getCollectionConditional('sales',
      ref => ref.where('date', '==', this.currentDate)).subscribe(data => {

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
            currency: e.payload.doc.data()['currency'],
            counter: e.payload.doc.data()['counter']
          };
        });
        
      });
  }

  getSalesWithCashier(cashierId: string) {

    this.waiting = true;

    this.firebaseService.getCollectionConditional('sales',
      ref => ref
      .where('date', '==', this.currentDate)
      .where('cashierId', '==', cashierId)).subscribe(data => {

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
            currency: e.payload.doc.data()['currency'],
            counter: e.payload.doc.data()['counter']
          };
        });
        
      });
  }

}
