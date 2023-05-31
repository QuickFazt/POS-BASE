import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit {

  form: FormGroup;
  selectedFile;
  imgLoaded = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [''],
      email: [''.toLowerCase(), [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      img: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
   
  }

  async chooseImage(event) {
    setTimeout(() => {
      this.imgLoaded = true;
    }, 2000);
    this.selectedFile = event.target.files;
    this.img.setValue(await this.firebaseService.uploadPhoto(Date.now().toString(), this.selectedFile));
  }

  async Submit() {
    if (this.Validator()) {
      this.CreateUserAuth();
    } else {
      this.firebaseService.Toast('Completa los campos correctamente');
    }
  }

/**CreateUserAuth()
 * Crea al usuario en Firebase Authentication
 */
  async CreateUserAuth() {
 
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.CreateUser(this.form.value).then(res => {
      this.id.setValue(res.user.uid);     
      this.CreateUserDB();     
      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

/**CreateUserDB()
 * Crea al usuario en la base de datos en Firebase Firestore, en la colección 'users'
 */
  async CreateUserDB() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.addToCollectionById('users',this.form.value).then(res => {

     this.CreateUserRole();     
      
      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

/**CreateUserRole()
 * Crea el rol del usuario en la base de datos en Firebase Firestore, en la colección 'roles'
 */
  async CreateUserRole() {

    let role = {
      id: this.id.value,
      role: this.role.value
    };

    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.addToCollectionById('roles', role).then(res => {

      this.firebaseService.Toast('¡Usuario creado con éxito!');
      this.modalController.dismiss();

      this.form.reset();
      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

  Validator() {
    if (!this.img) {
      this.firebaseService.Toast('Selecciona la foto del usuario');
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
  get email() {
    return this.form.get('email');
  }
  get img() {
    return this.form.get('img');
  }
  get password() {
    return this.form.get('password');
  }
  get name() {
    return this.form.get('name');
  }
  get lastname() {
    return this.form.get('lastname');
  }
  get dni() {
    return this.form.get('dni');
  }
  get role() {
    return this.form.get('role');
  }

}
