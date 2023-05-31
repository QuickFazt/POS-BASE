import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  @Input() product: Product;
  form: FormGroup;
  selectedFile;
  imgLoaded = false;

  constructor(private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
     
    this.form = this.formBuilder.group({
      id: [this.product.id, [Validators.required]],
      name: [this.product.name, [Validators.required]],      
      image: [this.product.image, [Validators.required]],
      price: [this.product.price, [Validators.required]],
      stock: [this.product.stock, [Validators.required]]
    });

  }

  async chooseImage(event) {
    setTimeout(() => {
      this.imgLoaded = true;
    }, 2000);
    this.selectedFile = event.target.files;
    this.image.setValue(await this.firebaseService.uploadPhoto(this.product.id, this.selectedFile));
  }


  async Submit() {
    if (this.Validator()) {
      this.UpdateProduct();
    } else {
      this.firebaseService.Toast('Completa los campos correctamente');
    }
  }


  async UpdateProduct() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.UpdateCollection('products',this.form.value).then(res => {

      this.firebaseService.Toast('¡Producto actualizado exitosamente!');
      this.modalController.dismiss();

      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }


  Validator() {
    if (!this.image.value) {
      this.firebaseService.Toast('Selecciona la imagen del producto');
      return false;
    }

    if (!this.form.valid) {
      this.firebaseService.Toast('Ingresa todos los campos correctamente');
      return false;
    }

    return true;
  }

  get id() {
    return this.form.get('id');
  }

  get name() {
    return this.form.get('name');
  }

  get image() {
    return this.form.get('image');
  }

  get price() {
    return this.form.get('price');
  }
  get stock() {
    return this.form.get('stock');
  }

}

