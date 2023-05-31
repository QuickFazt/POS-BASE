import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { EditCurrencyComponent, NewCurrencyComponent } from './components';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.page.html',
  styleUrls: ['./currency.page.scss'],
})
export class CurrencyPage implements OnInit {

  bsToUSD: number;
  bsToEUR: number;

  waiting: boolean;
  currency = [];
  
  constructor(
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.getCurrency();
  }

  async newCurrency() {
    const modal = await this.modalController.create({
      component: NewCurrencyComponent, 
      cssClass: 'currency-modal' 
    });
    await modal.present();
  }

  async editCurrency(currency) {
    const modal = await this.modalController.create({
      component: EditCurrencyComponent,
      componentProps:{currency: currency},
      cssClass: 'currency-modal'   
    });
    await modal.present();
  }

  async Options(currency) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',      
      buttons: [            
        {
        text: 'Editar',
        icon: 'create-outline',
        handler: () => {
          this.editCurrency(currency);
        }
      }, {
        text: 'Eliminar',
        icon: 'trash-outline',    
        handler: () => {
         this.confirmDelete(currency.id)
        }
      }]
    });
  
    await actionSheet.present();
  }

  async confirmDelete(id) {

    const alert = await this.alertController.create({   
      message: '¿Estás seguro/a de eliminar esta moneda?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {         
          }
        }, {
          text: 'Eliminar',
          handler: () => {          
              this.DeleteCurrency(id);  
          }
        }
      ]
    });
  
    await alert.present();
  }


  async DeleteCurrency(id) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.deleteFromCollection('currency', id).then(res => {
      this.firebaseService.Toast('Moneda eliminada exitosamente');
 
      loading.dismiss();

    }, error => {

      this.firebaseService.Toast('Ha ocurrido un error, intenta de nuevo');
      loading.dismiss();
      console.log(error);
      
    })
  }

  getCurrency() {
    this.waiting = true;

    this.firebaseService.getCollection('currency')
      .subscribe(data => {

        this.waiting = false;

        this.currency = data.map(e => {
          return {
            id: e.payload.doc.id,
            symbol: e.payload.doc.data()['symbol'],           
            name: e.payload.doc.data()['name'],
            price: e.payload.doc.data()['price']                  
          };
        });


      }, error => {
        console.log(error)
      });
  } 


  /** Tasas del dolar y euro en Bs automáticas */
  exchangeRates() {
    this.waiting = true;
    this.firebaseService.exchangeRates().subscribe((res: any) => {
      this.bsToUSD = res.USD.dolartoday;
      this.bsToEUR = res.EUR.dolartoday;
      this.waiting = false;
    }, error => {
      console.log(error);

    })
  }
}
