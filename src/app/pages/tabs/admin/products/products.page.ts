import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { EditCategoryComponent, NewCategoryComponent, NewProductComponent } from './components';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  categories = [];
  waiting: boolean;

  constructor(
    private firebaseService: FirebaseService,   
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.getCategories();
  }


  async newCategory() {
    const modal = await this.modalController.create({
      component: NewCategoryComponent
    });

    await modal.present();

  }

  async editCategory(category) {
    const modal = await this.modalController.create({
      component: EditCategoryComponent,
      componentProps:{category:category}
    });

    await modal.present();

  }

  async newProduct(category) {
    const modal = await this.modalController.create({
      component: NewProductComponent,
      componentProps: {_categoryId: category.id,
                       _categoryName: category.name,
      }
    });

    await modal.present();

  }

  getCategories() {
    this.waiting = true;

    this.firebaseService.getCollection('categories')
      .subscribe(data => {

        this.waiting = false;

        this.categories = data.map(e => {
          return {
            id: e.payload.doc.id,
            image: e.payload.doc.data()['image'],           
            name: e.payload.doc.data()['name']                 
          };
        });


      }, error => {
        console.log(error)
      });
  }


  async Options(category) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',      
      buttons: [
        {
          text: 'Gestionar Productos',
          icon: 'cart-outline',
          handler: () => {
            this.firebaseService.routerLink().navigateByUrl('/tabs/admin/products/products-by-category/'+category.id+'/'+category.name)
          }
        },
        {
          text: 'Agregar Producto',
          icon: 'add',
          handler: () => {
           this.newProduct(category)
          }
        },
        {
        text: 'Editar Categoría',
        icon: 'create-outline',
        handler: () => {
          this.editCategory(category);
        }
      }, {
        text: 'Eliminar Categoría',
        icon: 'trash-outline',    
        handler: () => {
         this.confirmDelete(category.id)
        }
      }]
    });
  
    await actionSheet.present();
  }




  async confirmDelete(id) {
  
    const alert = await this.alertController.create({   
      message: '¿Estás seguro/a de eliminar esta categoría? Se eliminaran todos los productos pertenecientes a la misma',
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
              this.DeleteCategory(id);  
          }
        }
      ]
    });
  
    await alert.present();
  }


  async DeleteCategory(id) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.deleteFromCollection('categories', id).then(res => {

      this.DeleteCategoryProducts(id);
      loading.dismiss();

    }, error => {

      this.firebaseService.Toast('Ha ocurrido un error, intenta de nuevo');
      loading.dismiss();
      console.log(error);
      
    })
  }

  async DeleteCategoryProducts(id) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.deleteFromCollectionCascade('products','categoryId', id).then(res => {

      this.firebaseService.Toast('Categoría eliminada exitosamente');
      loading.dismiss();

    }, error => {

      this.firebaseService.Toast('Ha ocurrido un error, intenta de nuevo');
      loading.dismiss();
      console.log(error);
      
    })
  }
}

