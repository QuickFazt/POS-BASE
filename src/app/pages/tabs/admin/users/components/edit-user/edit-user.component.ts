import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {

  @Input() user = {} as User;

  form: FormGroup;
  selectedFile;
  imgLoaded = false;
  uid: string;

  constructor(private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {


    this.form = this.formBuilder.group({
      id: [this.user.id],
      name: [this.user.name, [Validators.required]],
      img: [this.user.img, [Validators.required]],
      lastname: [this.user.lastname, [Validators.required]],
      dni: [this.user.dni, [Validators.required]],
      role: ['', [Validators.required]],
    });

    this.getUserRole();
    this.uid = localStorage.getItem('uid');
  }

  async chooseImage(event) {
    setTimeout(() => {
      this.imgLoaded = true;
    }, 2000);
    this.selectedFile = event.target.files;
    this.img.setValue(await this.firebaseService.uploadPhoto(this.user.id, this.selectedFile));
  }


  getUserRole() {
    this.firebaseService.getDataById('roles',this.user.id).valueChanges()
      .subscribe(data => {
        this.role.setValue(data['role']);
      }, error => {     
      });
  }

  async Submit() {
    if (this.Validator()) {
      this.UpdateUser();
    } else {
      this.firebaseService.Toast('Completa los campos correctamente');
    }
  }


  async UpdateUser() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.UpdateCollection('users',this.form.value).then(res => {

      if (this.user.id !== this.uid) {
        this.UpdateUserRole();
      } else {
        this.firebaseService.Toast('¡Usuario actualizado con éxito!');
        this.modalController.dismiss();
      }

      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

  async UpdateUserRole() {

    const roleData = {
      id: this.id.value,
      role: this.role.value
    }

    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.UpdateCollection('roles', roleData).then(res => {

      this.firebaseService.Toast('¡Usuario actualizado con éxito!');
      this.modalController.dismiss();

      this.form.reset();
      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

  Validator() {
    if (!this.user.img) {
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
