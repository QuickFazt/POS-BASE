import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController} from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {

  @Input() category;
 

  form: FormGroup;
  selectedFile;
  imgLoaded = false;

  constructor(private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
       
    this.form = this.formBuilder.group({      
      id: [this.category.id, [Validators.required]],
      name: [this.category.name, [Validators.required]],  
      image: [this.category.image, [Validators.required]]        
    });  

  }

  async chooseImage(event) {
    setTimeout(() => {
      this.imgLoaded = true;
    }, 2000);
    this.selectedFile = event.target.files;
    this.image.setValue(await this.firebaseService.uploadPhoto(this.category.id, this.selectedFile));
  }


  async Submit() {
    if (this.Validator()) {
      this.updateCategory();
    } else {
      this.firebaseService.Toast('Completa los campos correctamente');
    }
  }


  async updateCategory() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.UpdateCollection('categories',this.form.value).then(res => {

      this.firebaseService.Toast('¡Categoría actualizada exitosamente!');
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

