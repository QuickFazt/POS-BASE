import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-open-pos',
  templateUrl: './open-pos.component.html',
  styleUrls: ['./open-pos.component.scss'],
})
export class OpenPosComponent implements OnInit {

  form: FormGroup;
  @Input() openingCounter;
  @Input() _posId;
  waiting: boolean;
  users = [];
  currentUser: string;
  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      initialBase: [1000, [Validators.required]],
      posId: [this._posId, [Validators.required]],
      profit: [0],     
      salesCounter: [0],   
      cashierId: ['', [Validators.required]],
      openingDate: ['', [Validators.required]],
      openingHour: ['', [Validators.required]],
      closingDate: ['En curso', [Validators.required]],
      closingHour: ['En curso', [Validators.required]],
      counter: [this.openingCounter, [Validators.required]],
      total: [0, [Validators.required]]
    });

    this.currentUser = localStorage.getItem('uid');
    this.getUsers();
  }

  async Submit() {
    this.total.setValue(this.initialBase.value);
    this.openingDate.setValue(this.datePipe.transform(Date.now(), 'yyyy-MM-dd'));
    this.openingHour.setValue(this.datePipe.transform(Date.now(), 'h:mm a'));

        
    if (this.form.valid) {
      this.openPos();
    } else {
      this.firebaseService.Toast('Ingresa la base inicial y asigna un cajero a esta apertura');
    }
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
            lastname: e.payload.doc.data()['lastname']            
          };
        });


      }, error => {
        console.log(error)
      });
  }

  async openPos() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.addToCollection('pos_openings', this.form.value).then(res => {

      this.updatePosStatus();

      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

  async updatePosStatus(){

    const status = {id: this._posId, opened: true};

    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.UpdateCollection('poss', status).then(res => {

      this.firebaseService.Toast('¡Apertura realizada exitosamente!');
      this.modalController.dismiss();

      loading.dismiss();

    }, error => {
      
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }

  

  get initialBase() {
    return this.form.get('initialBase');
  }

  get total() {
    return this.form.get('total');
  }

  get salesCounter() {
    return this.form.get('salesCounter');
  }  
 
  get posId() {
    return this.form.get('posId');
  }

  get cashierId() {
    return this.form.get('cashierId');
  }

  get openingDate() {
    return this.form.get('openingDate');
  }

  get openingHour() {
    return this.form.get('openingHour');
  }

  get counter() {
    return this.form.get('counter');
  }
}

