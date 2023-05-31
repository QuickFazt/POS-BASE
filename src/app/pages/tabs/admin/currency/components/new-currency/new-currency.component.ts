import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-new-currency',
  templateUrl: './new-currency.component.html',
  styleUrls: ['./new-currency.component.scss'],
})
export class NewCurrencyComponent implements OnInit {

  form: FormGroup;
  mask = { prefix: '$ ', thousands: '.', decimal: ',',align: 'left' }
  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],  
      symbol: ['', [Validators.required]], 
      price: ['', [Validators.required, Validators.min(0.01)]]     
    });

  }
 
  changeSymbol(){   
    this.mask.prefix = this.symbol.value+' ';    
  }


  async Submit() {
    if (this.Validator()) {
      this.createCurrency();
    } else {
      this.firebaseService.Toast('Completa los campos correctamente');
    }
  }


  async createCurrency() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.addToCollection('currency', this.form.value).then(res => {

      this.firebaseService.Toast('¡Moneda creada exitosamente!');
      this.modalController.dismiss();

      loading.dismiss();
    }, error => {
      this.firebaseService.Toast(error.message);
      loading.dismiss();
    });
  }


  Validator() {
   
    if (!this.form.valid) {
      this.firebaseService.Toast('Ingresa todos los campos correctamente');
      return false;
    }

    return true;
  }


  get name() {
    return this.form.get('name');
  }
  get symbol() {
    return this.form.get('symbol');
  }
  get price() {
    return this.form.get('price');
  }
  

}
