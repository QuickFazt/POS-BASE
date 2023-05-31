import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { ToastController } from '@ionic/angular';
import { Client } from 'src/app/models/client.model';
import { GenerateReceiptPage } from 'src/app/pages/tabs/generate-receipt/generate-receipt.page';
import { FirebaseService } from 'src/app/services/firebase.service';

import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
})
export class UserDataComponent implements OnInit {

  form: FormGroup;
  searchForm: FormGroup;
  type = 'old';
  waiting: boolean;
  clients = [];
  client = {} as Client;
  clientExist: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private generateReceipt: GenerateReceiptPage,
    private receiptService: ReceiptService,
    private firebaseService: FirebaseService,
    private keyboard: Keyboard
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      dniSearch: [''],
    });

    this.form = this.formBuilder.group({
      name: [''.toLowerCase(), [Validators.required, Validators.pattern('[a-z A-Z]{1,11}')]],
      lastname: [''.toLowerCase(), [Validators.required, Validators.pattern('[a-z A-Z]{1,11}')]],
      dni: ['', [Validators.required]]
    });

    this.clientExist = true;
  }

  async Submit() {

    if (this.form.valid) {
      const loading = await this.firebaseService.loader().create();
      await loading.present();
      await this.firebaseService.getCollectionConditional('clients',
        ref => ref.where('dni', '==', this.dni.value))
        .subscribe(data => {
          loading.dismiss();

          let clients = data.map(e => {
            return {
              id: e.payload.doc.id,
              dni: e.payload.doc.data()['dni'],
              name: e.payload.doc.data()['name'],
              lastname: e.payload.doc.data()['lastname']
            };
          });

          if(clients.length == 0){
            this.CreateClient();
          }else{
            this.firebaseService.Toast('Este cliente es frecuente, no hace falta agregar como nuevo');
            this.getClient(this.clients[0]);
          }


        }, error => {
          loading.dismiss();
          console.log(error)
        });

    } else {
      this.firebaseService.Toast('Ingresa todos los campos correctamente');
    }
  }

  async CreateClient() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.addToCollection('clients', this.form.value).then(res => {

      this.receiptService.SaveClient(res.id);
      this.generateReceipt.Step3();
      this.form.reset();

      this.firebaseService.Toast('Cliente guardado');

      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

  getClient(client) {
    this.receiptService.SaveClient(client);
    this.generateReceipt.Step3();
    this.form.reset();
  }

  async searchClient() {
    this.keyboard.hide();
    if (this.dniSearch.value) {
      this.waiting = true;

      await this.firebaseService.getCollectionConditional('clients',
        ref => ref.where('dni', '==', this.dniSearch.value))
        .subscribe(data => {

          this.waiting = false;

          this.clients = data.map(e => {
            return {
              id: e.payload.doc.id,
              dni: e.payload.doc.data()['dni'],
              name: e.payload.doc.data()['name'],
              lastname: e.payload.doc.data()['lastname']
            };
          });

          if (this.clients.length == 0) {
            this.clientExist = false;
          } else {
            this.clientExist = true;
          }

        }, error => {
          console.log(error)
        });

    } else {
      this.firebaseService.Toast('Ingrese el DNI del cliente')
    }

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

  get dniSearch() {
    return this.searchForm.get('dniSearch');
  }


}
