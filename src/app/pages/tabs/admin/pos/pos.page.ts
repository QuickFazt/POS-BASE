import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.page.html',
  styleUrls: ['./pos.page.scss'],
})
export class PosPage implements OnInit {

  poss = [];
  waiting: boolean;

  constructor(
    private alertController: AlertController,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.getPoss();
  }


  getPoss() {
    this.waiting = true;

    this.firebaseService.getCollectionConditional('poss',
      ref => ref.orderBy('number','asc'))
      .subscribe(data => {

        this.waiting = false;

        this.poss = data.map(e => {
          return {
            id: e.payload.doc.id,
            number: e.payload.doc.data()['number'],
            opened: e.payload.doc.data()['opened']           
          };
        });


      }, error => {
        console.log(error)
      });
  }

  async newPos() {

    const pos = { number: this.poss.length + 1, opened: false};

    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.addToCollection('poss', pos).then(res => {

      this.firebaseService.Toast('¡Pos creado exitosamente!');     

      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

  async newPosConfirm() {
    const alert = await this.alertController.create({
      message: '¿Quieres registrar un nuevo punto de venta? Una vez creado no puede eliminarse',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'secondary'
        }, {
          text: 'Aceptar',
          handler: () => {
           this.newPos()
          }
        }
      ]
    });

    await alert.present();
  }
}
