import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-edit-currency',
  templateUrl: './edit-currency.component.html',
  styleUrls: ['./edit-currency.component.scss'],
})
export class EditCurrencyComponent implements OnInit {

  form: FormGroup;
  mask = { prefix: '$ ', thousands: '.', decimal: ',', align: 'left' }
  @Input() currency;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id:[this.currency.id, [Validators.required]],
      name: [this.currency.name, [Validators.required]],
      symbol: [this.currency.symbol, [Validators.required]],
      price: [this.currency.price, [Validators.required, Validators.min(0.01)]]
    });

    this.mask.prefix = this.currency.symbol+ ' ';
  }

  changeSymbol() {
    this.mask.prefix = this.symbol.value + ' ';
  }


  async Submit() {
    if (this.Validator()) {
      this.updateCurrency();
    } else {
      this.firebaseService.Toast('Completa los campos correctamente');
    }
  }


  async updateCurrency() {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.firebaseService.UpdateCollection('currency', this.form.value).then(res => {

      this.firebaseService.Toast('¡Moneda actualizada exitosamente!');
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

