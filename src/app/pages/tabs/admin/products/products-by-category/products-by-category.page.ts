import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NewProductComponent } from './../components';
import { OptionProductComponent, ProductDetailComponent } from './components';


@Component({
  selector: 'app-products-by-category',
  templateUrl: './products-by-category.page.html',
  styleUrls: ['./products-by-category.page.scss'],
})
export class ProductsByCategoryPage implements OnInit {

  products = [];
  waiting: boolean;
  categoryId: string;
  categoryName: string;
  result = '';
  constructor(
    private firebaseService: FirebaseService,
    private popoverController: PopoverController,
    private modalController: ModalController,   
    private actRoute: ActivatedRoute
  ) {

    this.categoryId = this.actRoute.snapshot.paramMap.get('id');
    this.categoryName = this.actRoute.snapshot.paramMap.get('name');

  }

  ngOnInit() {
    this.getProducts();
  }
  searchProduct(event) {
    const texto: string = event.target.value;
    this.result = texto;
  }

  async newProduct() {
    const modal = await this.modalController.create({
      component: NewProductComponent,
      componentProps: {
        _categoryId: this.categoryId,
        _categoryName: this.categoryName
      }
    });

    await modal.present();

  }

  async productDetail(product) {
     const modal = await this.modalController.create({
      component: ProductDetailComponent,
      componentProps: { product: product }
    });

    await modal.present();

  }

  async Options(event, product) {
    const popover = await this.popoverController.create({
      component: OptionProductComponent,
      event: event,
      componentProps: { product: product }
    });
    await popover.present();
  }

  getProducts() {
    this.waiting = true;

    this.firebaseService.getCollectionConditional('products',
      ref => ref.where('categoryId', '==', this.categoryId))
      .subscribe(data => {

        this.waiting = false;

        this.products = data.map(e => {
          return {
            id: e.payload.doc.id,
            image: e.payload.doc.data()['image'],
            name: e.payload.doc.data()['name'],
            description: e.payload.doc.data()['description'],
            price: e.payload.doc.data()['price'],
            stock: e.payload.doc.data()['stock'],
          };
        });


      }, error => {
        console.log(error)
      });
  }


}
