import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController} from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent implements OnInit {

  form: FormGroup;
  selectedFile;
  imgLoaded = false;
  @Input() _categoryId: string;
  @Input() _categoryName: string;
  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {

    this.form = this.formBuilder.group({         
      name: ['', [Validators.required]],
      categoryId: [this._categoryId, [Validators.required]],     
      image: ['', [Validators.required]],
      price: [1, [Validators.required]],
      stock: [1, [Validators.required]]     
    });  

  }

  async chooseImage(event) {
    setTimeout(() => {
      this.imgLoaded = true;
    }, 2000);
    this.selectedFile = event.target.files;
    this.image.setValue(await this.firebaseService.uploadPhoto(Date.now().toString(), this.selectedFile));
  }


  async Submit() {
    if (this.Validator()) {
      this.CreateProduct();
    } else {
      this.firebaseService.Toast('Completa los campos correctamente');
    }
  }


  async CreateProduct() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.addToCollection('products',this.form.value).then(res => {

      this.firebaseService.Toast('¡Producto creado exitosamente!');
      this.firebaseService.routerLink().navigateByUrl('/tabs/admin/products/products-by-category/'+this._categoryId+'/'+this._categoryName)
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


  get name() {
    return this.form.get('name');
  }

  get categoryId() {
    return this.form.get('categoryId');
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
