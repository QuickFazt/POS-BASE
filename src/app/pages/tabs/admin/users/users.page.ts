import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { OptionUserComponent } from './components/option-user/option-user.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NewUserComponent } from './components';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users = [];
  waiting: boolean;
  currentUser;
  result = '';

  constructor(
    private firebaseService: FirebaseService,
    private popoverController: PopoverController,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.getUsers();
  }

  ionViewWillEnter() {
    this.currentUser = localStorage.getItem('uid');
  }

  searchUser(event) {
    const texto: string = event.target.value;
    this.result = texto;
  }

  async NewUser() {
    const modal = await this.modalController.create({
      component: NewUserComponent,
    });

    await modal.present();

  }

  async Options(event, user) {
    const popover = await this.popoverController.create({
      component: OptionUserComponent,
      event: event,
      componentProps: {
        user: user,
        currentUser: this.currentUser
      }
    });
    await popover.present();
  }


  getUsers() {
    this.waiting = true;

    this.firebaseService.getCollection('users')
      .subscribe(data => {

        this.waiting = false;

        this.users = data.map(e => {
          return {
            id: e.payload.doc.id,
            img: e.payload.doc.data()['img'],
            dni: e.payload.doc.data()['dni'],
            name: e.payload.doc.data()['name'],
            lastname: e.payload.doc.data()['lastname'],
            email: e.payload.doc.data()['email'],
            password: e.payload.doc.data()['password']
          };
        });

      }, error => {
        console.log(error)
      });
  }



}

