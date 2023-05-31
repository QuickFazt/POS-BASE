import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { UserDetailComponent } from 'src/app/components/common/user-detail/user-detail.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { EditUserComponent } from '../edit-user/edit-user.component';


@Component({
  selector: 'app-option-user',
  templateUrl: './option-user.component.html',
  styleUrls: ['./option-user.component.scss'],
})
export class OptionUserComponent implements OnInit {


  @Input() user;
  @Input() currentUser;
  constructor(private modalController: ModalController,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private firebaseService: FirebaseService) { }

  ngOnInit() {

   }

   async userDetail() {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: UserDetailComponent,
      componentProps: { user: this.user },
      cssClass: 'profile-modal'
    });
    await modal.present();
  }


  async editUser() {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: EditUserComponent,
      componentProps: { user: this.user }
    });
    await modal.present();
  }


  //==========Eliminar Usuario Auth, DB y Rol=================

async confirmDelete() {
  this.popoverController.dismiss();
  const alert = await this.alertController.create({   
    message: '¿Estás seguro/a de eliminar este usuario?',
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
          this.AuthForDelete();          
        }
      }
    ]
  });

  await alert.present();
}


  async AuthForDelete() {
    
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.AuthForDelete(this.user.email, this.user.password).then(res => {
      loading.dismiss();
      this.DeleteUserAuth();
    }, error => {
      loading.dismiss();
      console.log(error);
    })
  }


  async DeleteUserAuth() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.DeleteUserAuth().then(res => {

      this.DeleteUserDB();
      loading.dismiss();

    }, error => {

      loading.dismiss();
      console.log(error);
      
    })
  }

  async DeleteUserDB() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.deleteFromCollection('users',this.user.id).then(res => {

      this.DeleteUserRole();
      loading.dismiss();

    }, error => {

      loading.dismiss();
      console.log(error);

    })
  }

  async DeleteUserRole() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.deleteFromCollection('roles',this.user.id).then(res => {

    this.firebaseService.Toast('Usuario eliminado exitosamente')
      loading.dismiss();
      
    }, error => {

      loading.dismiss();
      console.log(error);

    })
  }
//===========================
}
