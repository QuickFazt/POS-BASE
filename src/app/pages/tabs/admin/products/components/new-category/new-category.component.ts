import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController} from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss'],
})
export class NewCategoryComponent implements OnInit {


  form: FormGroup;
  selectedFile;
  imgLoaded = false;
  
  constructor(private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({         
      name: ['', [Validators.required]],  
      image: ['', [Validators.required]]        
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
      this.CreateCategory();
    } else {
      this.firebaseService.Toast('Completa los campos correctamente');
    }
  }


  async CreateCategory() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.addToCollection('categories',this.form.value).then(res => {

      this.firebaseService.Toast('¡Categoría creada exitosamente!');
      this.modalController.dismiss();    
      
      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }


  Validator() {
    if (!this.image.value) {
      this.firebaseService.Toast('Selecciona la imagen de la categoría');
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

  get image() {
    return this.form.get('image');
  }


}
