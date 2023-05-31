import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ProductDetailComponent } from '..';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'app-option-product',
  templateUrl: './option-product.component.html',
  styleUrls: ['./option-product.component.scss'],
})
export class OptionProductComponent implements OnInit {

@Input() product;

 constructor(private modalController: ModalController,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private firebaseService: FirebaseService) { }

  ngOnInit() {}


  async productDetail() {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: ProductDetailComponent,
      componentProps: { product: this.product }
    });

    await modal.present();

  }

  async updateProduct() {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: EditProductComponent,
      componentProps: { product: this.product }
    });

    await modal.present();

  }

  async confirmDelete() {
    this.popoverController.dismiss();
    const alert = await this.alertController.create({   
      message: '¿Estás seguro/a de eliminar este producto?',
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
              this.DeleteProduct();  
          }
        }
      ]
    });
  
    await alert.present();
  }


  async DeleteProduct() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.deleteFromCollection('products',this.product.id).then(res => {

      this.firebaseService.Toast('Producto eliminado exitosamente');
      loading.dismiss();

    }, error => {

      this.firebaseService.Toast('Ha ocurrido un error, intenta de nuevo');
      loading.dismiss();
      console.log(error);
      
    })
  }

}
