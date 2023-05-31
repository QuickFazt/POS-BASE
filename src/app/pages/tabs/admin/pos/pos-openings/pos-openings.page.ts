import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { UserDetailComponent } from 'src/app/components/common/user-detail/user-detail.component';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { OpeningDetailComponent, OpenPosComponent } from './components';

@Component({
  selector: 'app-pos-openings',
  templateUrl: './pos-openings.page.html',
  styleUrls: ['./pos-openings.page.scss'],
})
export class PosOpeningsPage implements OnInit {


  inProgress = false;
  waiting: boolean;
  openings = [];
  inProgressId: string;
  posId: string;
  posNumber: string;

  user = {} as User;

  constructor(
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private datePipe: DatePipe,
    private alertController: AlertController,
    private actRoute: ActivatedRoute,
    private actionSheetController: ActionSheetController
  ) {

    this.posId = this.actRoute.snapshot.paramMap.get('id');
    this.posNumber = this.actRoute.snapshot.paramMap.get('number');
  }

  ngOnInit() {
    this.getOpenings();
  }


  async Options(opening) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Detalles de la Apertura',
          icon: 'document-text-outline',
          handler: () => {
            this.openingDetail(opening);
          }
        }, {
          text: 'Ventas realizadas',
          icon: 'stats-chart-outline',
          handler: () => {
            this.firebaseService.routerLink()
              .navigateByUrl('/tabs/admin/pos/pos-openings/' + this.posId + '/' + this.posNumber + '/sales/' + opening.id);
          }
        }, {
          text: 'Cajero Encargado',
          icon: 'person-outline',
          handler: () => {
            this.getUserData(opening.cashierId);
          }
        }]
    });

    await actionSheet.present();
  }

  async getUserData(id) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.getDataById('users', id).valueChanges()
      .subscribe(data => {
        loading.dismiss();
        this.user.id = id;
        this.user.name = data['name'];
        this.user.lastname = data['lastname'];
        this.user.email = data['email'];
        this.user.dni = data['dni'];
        this.user.img = data['img'];

        this.getCashier();
      }, error => {
        loading.dismiss();
      });
  }

  async getCashier() {
    const modal = await this.modalController.create({
      component: UserDetailComponent,
      cssClass: 'profile-modal',
      componentProps: { user: this.user }
    });

    await modal.present();

  }

  async openPos() {
    const modal = await this.modalController.create({
      component: OpenPosComponent,
      cssClass: 'opening-pos',
      componentProps: {
        openingCounter: this.openings.length + 1,
        _posId: this.posId
      }
    });

    await modal.present();

  }

  async openingDetail(opening) {

    opening.posCounter = this.posNumber;

    const modal = await this.modalController.create({
      component: OpeningDetailComponent,
      cssClass: 'opening-pos',
      componentProps: {
        opening: opening
      }
    });

    await modal.present();

  }

  async closePosConfirm() {
    const alert = await this.alertController.create({
      message: '¿Estás seguro/a de realizar este cierre de caja?',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'secondary'
        }, {
          text: 'Aceptar',
          handler: () => {
            this.closePos();
          }
        }
      ]
    });

    await alert.present();
  }

  async closePos() {

    const dates = {
      id: this.inProgressId,
      closingDate: this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
      closingHour: this.datePipe.transform(Date.now(), 'h:mm a')
    }

    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.UpdateCollection('pos_openings', dates).then(res => {

      this.updatePosStatus();
      loading.dismiss();

    }, error => {

      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

  async updatePosStatus() {

    const status = { id: this.posId, opened: false };

    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.UpdateCollection('poss', status).then(res => {

      this.firebaseService.Toast('¡Cierre de caja realizado exitosamente!');
      loading.dismiss();

    }, error => {

      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

  getOpenings() {
    this.waiting = true;

    this.firebaseService.getCollectionConditional('pos_openings',
      ref => ref.where('posId', '==', this.posId).orderBy('counter', 'desc'))
      .subscribe(data => {

        this.waiting = false;

        this.openings = data.map(e => {
          return {
            id: e.payload.doc.id,
            counter: e.payload.doc.data()['counter'],
            posId: e.payload.doc.data()['posId'],
            cashierId: e.payload.doc.data()['cashierId'],
            openingDate: e.payload.doc.data()['openingDate'],
            openingHour: e.payload.doc.data()['openingHour'],
            closingDate: e.payload.doc.data()['closingDate'],
            closingHour: e.payload.doc.data()['closingHour'],
            initialBase: e.payload.doc.data()['initialBase'],
            total: e.payload.doc.data()['total'],
            salesCounter: e.payload.doc.data()['salesCounter'],
            profit: e.payload.doc.data()['profit']
          };
        });


        //======Valida si hay una apertura de caja en curso========
        if (this.openings.filter(e => e.closingDate == 'En curso').length == 0) {
          this.inProgress = false;
        } else {
          this.inProgress = true;
          this.inProgressId = this.openings.filter(e => e.closingDate == 'En curso')[0].id;
        }


      }, error => {
        console.log(error)
      });
  }
}